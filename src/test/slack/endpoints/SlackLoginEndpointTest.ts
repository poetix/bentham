import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../../../main/slack/Api";
import { DropboxIdentity, GithubIdentity, IcarusAccessToken } from "../../../main/common/Api";
import { LoginService } from "../../../main/slack/services/LoginService";
import { SlackLoginEndpoint } from "../../../main/slack/endpoints/SlackLoginEndpoint";
import { mock, instance, when, verify, anyString } from "ts-mockito";

const mockLoginService: LoginService = mock(LoginService);
const loginService = instance(mockLoginService);

const endpoint = new SlackLoginEndpoint(loginService, "http://return.uri");

const _login = (cb, e) => endpoint.login(cb, e);

describe("Slack Login Endpoint", () => {
  it("should pass the Slack auth code to the login service to obtain an Icarus access token", async () => {
    const icarusAccessToken:IcarusAccessToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: undefined,
      githubUsername: undefined,
    }
    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusAccessToken));

      const result = await toPromise(_login, {
        queryStringParameters: {
          code: "the auth code"
        }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal(JSON.stringify(icarusAccessToken));
  });

  it("should contain user Dropbox id", async () => {
    const icarusAccessToken:IcarusAccessToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: 'the dropbox id',
      githubUsername: undefined,
    }

    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusAccessToken));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusAccessToken));
  });

  it("should contain GitHub username", async () => {
    const icarusAccessToken:IcarusAccessToken = {
      accessToken: 'the access token',
      userName: "Arthur Putey",
      dropboxAccountId: undefined,
      githubUsername: 'the github username',
    }
    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve(icarusAccessToken));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify(icarusAccessToken));
  });
});
