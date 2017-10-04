import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { OAuthService } from "../../../main/github/services/OAuthService";
import { OAuthEndpoint } from "../../../main/github/endpoints/OAuthEndpoint";
import { mock, instance, when, verify, anyString } from 'ts-mockito';

const mockedOauthService = mock(OAuthService);
const oauthService = instance(mockedOauthService);
when(mockedOauthService.getOAuthUri(anyString(), anyString())).thenReturn("http://oauth-uri");
when(mockedOauthService.processCode(anyString(), anyString(), anyString())).thenReturn(Promise.resolve("the-account-id"));

const endpoint = new OAuthEndpoint(oauthService);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the GitHub API", async () => {
      const result = await toPromise(_initiate, {
        headers: {
          Host: "aws-api"
        },
        queryStringParameters: {
          icarusAccessToken: "icarus-access-token"
        }
      });
      verify(mockedOauthService.getOAuthUri("aws-api", "icarus-access-token")).once();

      expect(result.statusCode).to.equal(302);
      expect(result.headers.Location).to.equal("http://oauth-uri");
  });

  it("should process the access code", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      queryStringParameters: {
        code: "github-access-code",
        state: "icarus-access-token"
      }
    });

    verify(mockedOauthService.processCode("icarus-access-token", "github-access-code", anyString())).once();

    // TODO Test it redirects to user report, when implemented
  })

});
