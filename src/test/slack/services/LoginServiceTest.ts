import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../../../main/slack/Api";
import { SlackClient } from "../../../main/slack/clients/SlackClient";
import { DropboxIdentity, SlackIdentity, IdentitySet, IcarusAccessToken } from "../../../main/common/Api";
import { IdentityService} from "../../../main/common/services/IdentityService";
import { LoginService } from "../../../main/slack/services/LoginService";
import { mock, instance, when, verify, anyString, anything } from "ts-mockito";

const mockSlackClient: SlackClient = mock(SlackClient);
const slackClient: SlackClient = instance(mockSlackClient);

when(mockSlackClient.getToken(anyString(), anyString())).thenReturn(Promise.resolve("the slack token"));
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

when(mockIdentityService.grantIcarusAccessToken(anything())).thenCall(slackIdentity => ({
  accessToken: slackIdentity.accessToken,
  userName: slackIdentity.userName,
  dropboxAccountId: undefined,
  githubUsername: undefined,
}));



const loginService = new LoginService(slackClient, identityService);

describe("The Login Service", () => {
  it("should fetch the user's credentials from Slack, and use them to obtain a Icarus Access Token from the Login service", async () => {
    const result = await loginService.login("the slack authorisation code", "http://return.uri");

    verify(mockSlackClient.getToken("the slack authorisation code", "http://return.uri"));

    expect(result).to.deep.equal({
      accessToken: "the slack token",
      userName: "Sonny Whether",
      dropboxAccountId: undefined,
      githubUsername: undefined
    });
  });
});
