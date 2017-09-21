import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { slackAuthCode, slackToken } from "../main/Api"
import { SlackClient } from "../main/clients/ClientApi";
import { SlackLoginEndpoint } from "../main/endpoints/SlackLoginEndpoint";

class TestSlackClient implements SlackClient {

  public receivedAuthCode: slackAuthCode = "";

  async getToken(authCode: slackAuthCode): Promise<slackToken> {
    this.receivedAuthCode = authCode;
    return "the token";
  }
}

const slackClient = new TestSlackClient();
const endpoint = new SlackLoginEndpoint(slackClient);

const _login = (cb, e) => endpoint.login(cb, e);

describe("Slack Login Endpoint", () => {
  it("should pass the Slack auth code to Slack to obtain an API token", async () => {
      const result = await toPromise(_login, {
        headers: {
          Host: "aws-api"
        },
        queryStringParameters: {
          code: "the auth code"
        }
      });

      expect(slackClient.receivedAuthCode).to.equal("the auth code");

      expect(result.statusCode).to.equal(200);
  });
});
