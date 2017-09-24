import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../main/Api";
import { SlackClient } from "../main/clients/ClientApi";
import { IdentityService, DropboxIdentity, SlackIdentity, IdentitySet, UserToken } from "../main/services/ServiceApi"
import { ConnectedLoginService } from "../main/services/Login"

class TestSlackClient implements SlackClient {

  public receivedAuthCode: slackAuthCode = "";

  async getToken(authCode: slackAuthCode): Promise<slackToken> {
    this.receivedAuthCode = authCode;
    return "the slack token";
  }

  async getUserDetails(token: string): Promise<any> {
    return {
      "ok": true,
      "user": {
        "name": "Sonny Whether",
        "id": "U0G9QF9C6"
      },
      "team": {
        "id": "T0G9PQBBK"
      }
    };
  }
}

class TestIdentityService implements IdentityService {

    dropboxIdentity?: DropboxIdentity = undefined

    async grantUserToken(slackIdentity: SlackIdentity): Promise<UserToken> {
      const result: UserToken = {
        accessToken: "the access token",
        identities: {
          slack: slackIdentity
        }
      };

      if (this.dropboxIdentity) {
        result.identities.dropbox = this.dropboxIdentity;
      }

      return result;
    }

    getUserToken(accessToken: string): Promise<UserToken> {
      throw new Error("Method not implemented.");
    }

    addIdentity<K extends keyof IdentitySet>(accessToken: string, name: K, value: IdentitySet[K]): Promise<UserToken> {
      throw new Error("Method not implemented.");
    }

}

const slackClient = new TestSlackClient();
const identityService = new TestIdentityService();
const loginService = new ConnectedLoginService(slackClient, identityService);


describe("The Connected Login Service", () => {
  it("should fetch the user's credentials from Slack, and use them to obtain a UserToken from the Login service", async () => {
    const result = await loginService.login("the slack authorisation code");

    expect(slackClient.receivedAuthCode).to.equal("the slack authorisation code");
    expect(result).to.deep.equal({
      accessToken: "the access token",
      identities: {
        slack: {
          id: "U0G9QF9C6",
          userName: "Sonny Whether",
          teamId: "T0G9PQBBK",
          accessToken: "the slack token"
        }
      }
    });
  });
});
