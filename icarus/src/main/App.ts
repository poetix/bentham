/**
Wires everything together
 */

import { UserToken } from "./services/ServiceApi";
import { LoginService } from "./services/Login";
import { SlackLoginEndpoint } from "./endpoints/SlackLoginEndpoint";
import { IdentityService } from "./services/Identity";
import { SlackClient } from "./clients/Slack";
import { HttpClient } from "./clients/Http";
import { IdentityRepository } from "./repositories/Identity";

const httpClient = new HttpClient();
const slackClient = new SlackClient(
  httpClient,
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET);

const identityRepo = new IdentityRepository();
const identityService = new IdentityService(identityRepo);
const loginService = new LoginService(slackClient, identityService);

// Endpoints
export const slackLoginEndpoint = new SlackLoginEndpoint(loginService);
