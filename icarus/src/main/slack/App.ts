// Clients
import { HttpClient } from "../common/clients/HttpClient";
import { SlackClient } from "./clients/SlackClient";
import { IdentityRepository } from "../common/repositories/IdentityRepository";
import { IdentityService } from "../common/services/IdentityService";
import { LoginService } from "./services/LoginService";
import { SlackLoginEndpoint } from "./endpoints/SlackLoginEndpoint";
import { DynamoClient } from "../common/clients/DynamoClient";

const httpClient = new HttpClient();
const slackClient = new SlackClient(
  httpClient,
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET);

const dynamoClient = new DynamoClient(process.env.TABLE_PREFIX);

// Repositories
const identityRepo = new IdentityRepository(dynamoClient);
const identityService = new IdentityService(identityRepo);

// Services
const loginService = new LoginService(slackClient, identityService);

// Endpoints
export const slackLoginEndpoint = new SlackLoginEndpoint(loginService);
