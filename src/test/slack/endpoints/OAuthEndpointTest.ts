import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../../../main/slack/Api";
import { DropboxIdentity, GithubIdentity, IcarusUserToken } from "../../../main/common/Api";
import { OAuthService } from "../../../main/slack/services/OAuthService";
import { OAuthEndpoint } from "../../../main/slack/endpoints/oAuthEndpoint";
import { mock, instance, when, verify, anyString } from "ts-mockito";

const mockOAuthService: OAuthService = mock(OAuthService);
const oAuthService = instance(mockOAuthService);

const endpoint = new OAuthEndpoint(oAuthService, "http://return.uri");

const _login = (cb, e) => endpoint.login(cb, e);

describe("Slack OAuth Endpoint", () => {
  it("should pass the Slack auth code to the login service to obtain an Icarus user token", async () => {
    const icarusUserToken:IcarusUserToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: undefined,
      githubUsername: undefined,
    }
    when(mockOAuthService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusUserToken));

      const result = await toPromise(_login, {
        queryStringParameters: {
          code: "the auth code"
        }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal(JSON.stringify(icarusUserToken));
  });

  it("should contain user Dropbox id", async () => {
    const icarusUserToken:IcarusUserToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: 'the dropbox id',
      githubUsername: undefined,
    }

    when(mockOAuthService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusUserToken));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusUserToken));
  });

  it("should contain GitHub username", async () => {
    const icarusUserToken:IcarusUserToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: undefined,
      githubUsername: 'the github username',
    }
    when(mockOAuthService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusUserToken));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusUserToken));
  });
});
