import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../../../main/slack/Api";
import { DropboxIdentity, GithubIdentity, UserToken } from "../../../main/common/Api";
import { LoginService } from "../../../main/slack/services/LoginService";
import { SlackLoginEndpoint } from "../../../main/slack/endpoints/SlackLoginEndpoint";
import { mock, instance, when, verify, anyString } from "ts-mockito";

const mockLoginService: LoginService = mock(LoginService);
const loginService = instance(mockLoginService);

const endpoint = new SlackLoginEndpoint(loginService, "http://return.uri");

const _login = (cb, e) => endpoint.login(cb, e);

describe("Slack Login Endpoint", () => {
  it("should pass the Slack auth code to the login service to obtain a user token", async () => {
    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve({
      accessToken: "the access token",
      identities: {
        slack: {
          id: "the slack id",
          teamId: "the slack team id",
          userName: "Arthur Putey",
          accessToken: "the slack access token"
        }
      }
    }));

      const result = await toPromise(_login, {
        queryStringParameters: {
          code: "the auth code"
        }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal(JSON.stringify({
        userName: "Arthur Putey",
        accessToken: "the access token",
        hasDropboxAuthorisation: false,
        hasGithubAuthorisation: false,
      }));
  });

  it("should report on whether the user has Dropbox authorisation", async () => {

    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve({
      accessToken: "the access token",
      identities: {
        slack: {
          id: "the slack id",
          teamId: "the slack team id",
          userName: "Arthur Putey",
          accessToken: "the slack access token"
        },
        dropbox: {
          id: "the dropbox id",
          accessToken: "the dropbox access token"
        }
      }
    }));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify({
      userName: "Arthur Putey",
      accessToken: "the access token",
      hasDropboxAuthorisation: true,
      hasGithubAuthorisation: false
    }));
  });

  it("should report on whether the user has GitHub authorisation", async () => {

    when(mockLoginService.login(anyString(), anyString())).thenReturn(Promise.resolve({
      accessToken: "the access token",
      identities: {
        slack: {
          id: "the slack id",
          teamId: "the slack team id",
          userName: "Arthur Putey",
          accessToken: "the slack access token"
        },
        github: {
          id: "the dropbox id",
          accessToken: "the github access token"
        }
      }
    }));

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.equal(JSON.stringify({
      userName: "Arthur Putey",
      accessToken: "the access token",
      hasDropboxAuthorisation: false,
      hasGithubAuthorisation: true
    }));
  });
});
