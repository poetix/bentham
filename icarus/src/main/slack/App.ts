// Clients
import { HttpClient } from "../common/clients/HttpClient";
import { SlackClient } from "./clients/SlackClient";
import { IdentityRepository } from "../common/repositories/IdentityRepository";
import { IdentityService } from "../common/services/IdentityService";
import { LoginService } from "./services/LoginService";
import { SlackLoginEndpoint } from "./endpoints/SlackLoginEndpoint";

const httpClient = new HttpClient();
const slackClient = new SlackClient(
  httpClient,
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET);

// Repositories
const identityRepo = new IdentityRepository();
const identityService = new IdentityService(identityRepo);

// Services
const loginService = new LoginService(slackClient, identityService);

// Endpoints
export const slackLoginEndpoint = new SlackLoginEndpoint(loginService);
