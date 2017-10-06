import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { OAuthService } from "../../../main/github/services/OAuthService";
import { OAuthEndpoint } from "../../../main/github/endpoints/OAuthEndpoint";
import { IcarusAccessToken } from "../../../main/common/Api";
import { mock, instance, when, verify, anyString } from 'ts-mockito';


const icarusAccessToken:IcarusAccessToken = {
  accessToken: 'slack-access-token',
  userName: 'slack-username',
  dropboxAccountId: undefined,
  githubUsername: 'github-username',
}

const mockedOauthService = mock(OAuthService);
const oauthService = instance(mockedOauthService);
when(mockedOauthService.getOAuthUri(anyString(), anyString(), anyString())).thenReturn("http://oauth-uri");
when(mockedOauthService.processCode(anyString(), anyString(), anyString())).thenReturn(Promise.resolve(icarusAccessToken));

const endpoint = new OAuthEndpoint(oauthService);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

// FIXME Re-enable tests when implementation is fixed
describe.skip("Github OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the GitHub API", async () => {
      const result = await toPromise(_initiate, {
        headers: {
          Host: "aws-api"
        },
        requestContext: {
          stage: 'lambda-stage'
        },
        queryStringParameters: {
          slackAccessToken: "slack-access-token"
        }
      });
      verify(mockedOauthService.getOAuthUri("aws-api", "lambda-stage", "slack-access-token")).once();

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

  it("should process the access code", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      requestContext: {
        stage: 'lambda-stage'
      },
      queryStringParameters: {
        code: "github-access-code",
        state: "slack-access-token"
      }
    });

    verify(mockedOauthService.processCode("slack-access-token", "github-access-code", anyString())).once();

    // TODO Test it redirects to user report, when implemented
  })


  it("should return an Icarus Access Token including Dropbox ID on completion", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      requestContext: {
        stage: 'lambda-stage'
      },
      queryStringParameters: {
        code: "the code",
        slackAccessToken: "slack-access-token",
        initReturnUri: 'http://return.uri'
      }
    });

    verify(mockedOauthService.processCode("slack-access-token", "the code", 'http://return.uri')).once();

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusAccessToken));
  })

});
