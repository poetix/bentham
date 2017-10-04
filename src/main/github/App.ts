import { DynamoClient } from "../common/clients/DynamoClient"
import { HttpClient } from "../common/clients/HttpClient"
import { GithubClient } from "./clients/GithubClient"

import { UserEventRepository } from "./repositories/UserEventRepository"
import { TokenRepository } from "./repositories/TokenRepository"
import { IdentityRepository } from "../common/repositories/IdentityRepository"

import { IdentityService } from "../common/services/IdentityService"
import { WebhookEventService } from "./services/WebhookEventService"
import { OAuthService } from "./services/OAuthService"

import { WebhookEndpoint } from "./endpoints/WebhookEndpoint"
import { OAuthEndpoint } from "./endpoints/OAuthEndpoint";


// FIXME Move all resources shared with dropbox/App into a global App

// Clients
const dynamo = new DynamoClient(process.env.TABLE_PREFIX); // FIXME Shared with Dropbox
const httpClient = new HttpClient(); // FIXME Shared with Dropbox
const githubClient = new GithubClient(
  httpClient,
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET);

// Repositories
const userEventRepository = new UserEventRepository(dynamo)
const tokenRepository = new TokenRepository(dynamo);
const identityRepository = new IdentityRepository(dynamo); // FIXME Shared with Dropbox

// Services
const identityService = new IdentityService(identityRepository); // FIXME Shared with Dropbox
const webhookEventService = new WebhookEventService(userEventRepository, process.env.GITHUB_WEBHOOK_SECRET);
const oauthService = new OAuthService(identityService, githubClient, tokenRepository);


// Endpoints
export const webhookEndpoint = new WebhookEndpoint(webhookEventService);
export const oauthEndpoint = new OAuthEndpoint(oauthService);
