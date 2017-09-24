/**
Wires everything together
*/

import { HttpSlackClient } from "./clients/Slack";
import { LoginService, UserToken } from "./services/ServiceApi";
import { SlackLoginEndpoint } from "./endpoints/SlackLoginEndpoint";

const slackClient = new HttpSlackClient(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET);

// services
class StubLoginService implements LoginService {

  async login(slackCode: string): Promise<UserToken> {
    return {
      accessToken: "the access token",
      identities: {
        slack: {
          id: "the slack id",
          teamId: "the slack team id",
          userName: "Arthur Putey",
          accessToken: "the slack access token"
        }
      }
    };
  }
}

const loginService = new StubLoginService();

// Endpoints
export const slackLoginEndpoint = new SlackLoginEndpoint(loginService);
