import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { OAuthService } from "../../../main/github/services/OAuthService";
import { OAuthEndpoint } from "../../../main/github/endpoints/OAuthEndpoint";
import { IcarusUserToken } from "../../../main/common/Api";
import { mock, instance, when, verify, anyString } from 'ts-mockito';


const icarusUserToken:IcarusUserToken = {
  accessToken: 'icarus-access-token',
  userName: 'slack-username',
  dropboxAccountId: undefined,
  githubUsername: 'github-username',
}

const mockedOauthService = mock(OAuthService);
const oauthService = instance(mockedOauthService);
when(mockedOauthService.getOAuthAuthoriseUri(anyString(), anyString(), anyString(), anyString())).thenReturn("http://oauth-uri");
when(mockedOauthService.processCode(anyString(), anyString(), anyString())).thenReturn(Promise.resolve(icarusUserToken));

const endpoint = new OAuthEndpoint(oauthService);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("Github OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the GitHub API", async () => {
      const result = await toPromise(_initiate, {
        headers: {
          Host: "aws-api"
        },
        requestContext: {
          stage: 'lambda-stage'
        },
        queryStringParameters: {
          icarusAccessToken: "icarus-access-token",
          returnUri: 'http://return.uri'
        }
      });
      verify(mockedOauthService.getOAuthAuthoriseUri("aws-api", "lambda-stage", "icarus-access-token", 'http://return.uri')).once();

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

  it("should return an Icarus User Token including GitHub username on completion", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      requestContext: {
        stage: 'lambda-stage'
      },
      queryStringParameters: {
        code: "github-auth-code",
        icarusAccessToken: "icarus-access-token",
        initReturnUri: 'http://return.uri'
      }
    });

    verify(mockedOauthService.processCode("icarus-access-token", "github-auth-code", 'http://return.uri')).once();

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusUserToken));
  })

});
