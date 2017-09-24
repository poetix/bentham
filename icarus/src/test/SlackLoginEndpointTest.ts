import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../main/Api";
import { LoginService, DropboxIdentity, UserToken } from "../main/services/ServiceApi";
import { SlackLoginEndpoint } from "../main/endpoints/SlackLoginEndpoint";


class TestLoginService implements LoginService {
  receivedSlackCode: string;
  dropboxIdentity?: DropboxIdentity

  async login(slackCode: string): Promise<UserToken> {
    this.receivedSlackCode = slackCode;
    return {
      accessToken: "the access token",
      identities: {
        slack: {
          id: "the slack id",
          teamId: "the slack team id",
          userName: "Arthur Putey",
          accessToken: "the slack access token"
        },
        dropbox: this.dropboxIdentity
      }
    };
  }
}

const loginService = new TestLoginService();
const endpoint = new SlackLoginEndpoint(loginService);

const _login = (cb, e) => endpoint.login(cb, e);

describe("Slack Login Endpoint", () => {
  it("should pass the Slack auth code to the login service to obtain a user token", async () => {
      const result = await toPromise(_login, {
        queryStringParameters: {
          code: "the auth code"
        }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.deep.equal({
        userName: "Arthur Putey",
        accessToken: "the access token",
        hasDropboxAuthorisation: false
      });
  });

  it("should report on whether the user has Dropbox authorisation", async () => {
    loginService.dropboxIdentity = {
      id: "the dropbox id",
      accessToken: "the dropbox access token"
    };

    const result = await toPromise(_login, {
      queryStringParameters: {
        code: "the auth code"
      }
    });

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.deep.equal({
      userName: "Arthur Putey",
      accessToken: "the access token",
      hasDropboxAuthorisation: true
    });
  })
});
