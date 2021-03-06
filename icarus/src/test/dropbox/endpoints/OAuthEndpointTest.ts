import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { OAuthService } from "../../../main/dropbox/services/OAuthService";
import { OAuthEndpoint } from "../../../main/dropbox/endpoints/OAuthEndpoint";
import { mock, instance, when, verify, anyString } from 'ts-mockito';

const mockedOauthService = mock(OAuthService);
const oauthService = instance(mockedOauthService);
when(mockedOauthService.getOAuthUri(anyString(), anyString())).thenReturn("http://oauth-uri");
when(mockedOauthService.processCode(anyString(), anyString(), anyString())).thenReturn(Promise.resolve("the-account-id"));

const endpoint = new OAuthEndpoint(oauthService);

const _initiate = (cb, e) => endpoint.initiate(cb, e);
const _complete = (cb, e) => endpoint.complete(cb, e);

describe("OAuth Endpoint", () => {
  it("should redirect an 'initiate' request to the Dropbox API", async () => {
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

  it("should redirect to the user's report on completion", async () => {
    const result = await toPromise(_complete, {
      headers: {
        Host: "aws-api"
      },
      queryStringParameters: {
        code: "the code",
        state: "icarus-access-token"
      }
    });

    verify(mockedOauthService.processCode("icarus-access-token", "the code", anyString())).once();

    expect(result.statusCode).to.equal(302);
    expect(result.headers.Location).to.equal("https://aws-api/dev/dropbox-user-report?icarusAccessToken=icarus-access-token");
  });
});
