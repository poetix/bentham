import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../main/Api";
import { SlackClient } from "../main/clients/Slack";
import { DropboxIdentity, SlackIdentity, IdentitySet, UserToken } from "../main/services/ServiceApi"
import { IdentityService} from "../main/services/Identity";
import { LoginService } from "../main/services/Login";
import { mock, instance, when, verify, anyString, anything } from "ts-mockito";

const mockSlackClient: SlackClient = mock(SlackClient);
const slackClient: SlackClient = instance(mockSlackClient);

when(mockSlackClient.getToken(anyString())).thenReturn(Promise.resolve("the slack token"));
when(mockSlackClient.getUserDetails(anyString())).thenReturn(Promise.resolve({
  "ok": true,
  "user": {
    "name": "Sonny Whether",
    "id": "U0G9QF9C6"
  },
  "team": {
    "id": "T0G9PQBBK"
  }
}));

const mockIdentityService: IdentityService = mock(IdentityService);
const identityService: IdentityService = instance(mockIdentityService);

when(mockIdentityService.grantUserToken(anything())).thenCall(slackIdentity => {
  const result: UserToken = {
    accessToken: "the access token",
    identities: {
      slack: slackIdentity
    }
  };

  if (this.dropboxIdentity) {
    result.identities.dropbox = this.dropboxIdentity;
  }

  return Promise.resolve(result);
});

const loginService = new LoginService(slackClient, identityService);

describe("The Login Service", () => {
  it("should fetch the user's credentials from Slack, and use them to obtain a UserToken from the Login service", async () => {
    const result = await loginService.login("the slack authorisation code");

    verify(mockSlackClient.getToken("the slack authorisation code"));
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
