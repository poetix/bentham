import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { OAuthService } from "../../../main/dropbox/services/OAuthService";
import { IdentityService } from "../../../main/common/services/IdentityService";
import { OAuthEndpoint } from "../../../main/dropbox/endpoints/OAuthEndpoint";
import { IcarusAccessToken } from "../../../main/common/Api";
import { mock, instance, when, verify, anyString } from 'ts-mockito';

const icarusAccessToken:IcarusAccessToken = {
  accessToken: 'slack-access-token',
  userName: 'slack-username',
  dropboxAccountId: 'dropbox-account-id',
  githubUsername: undefined,
}

const mockedOauthService = mock(OAuthService);
const oauthService = instance(mockedOauthService);
when(mockedOauthService.getOAuthUri(anyString(), anyString(), anyString(), anyString())).thenReturn("http://oauth-uri");
when(mockedOauthService.processCode(anyString(), anyString(), anyString())).thenReturn(Promise.resolve(icarusAccessToken));

const mockedIdentityService = mock(IdentityService)
const identityService = instance(mockedIdentityService)

const endpoint = new OAuthEndpoint(oauthService, identityService);


const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("Dropbox OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the Dropbox API", async () => {
      const result = await toPromise(_initiate, {
        headers: {
          Host: "aws-api"
        },
        requestContext: {
          stage: 'lambda-stage'
        },
        queryStringParameters: {
          slackAccessToken: "slack-access-token",
          returnUri: 'http://return.uri'
        }
      });
      verify(mockedOauthService.getOAuthUri("aws-api", "lambda-stage", "slack-access-token", "http://return.uri")).once();

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

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
  });
});
