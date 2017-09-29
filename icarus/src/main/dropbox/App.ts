/**
Wires everything together
*/

import { DynamoClient } from "../common/clients/DynamoClient";
import { DropboxClient } from "./clients/DropboxClient";

import { OAuthService } from "./services/OAuthService"
import { ReportService } from "./services/ReportService"
import { NotificationService, FileUpdateRecorder } from "./services/NotificationService";

import { WebhookEndpoint } from "./endpoints/WebhookEndpoint";
import { OAuthEndpoint } from "./endpoints/OAuthEndpoint";
import { ReportEndpoint } from "./endpoints/ReportEndpoint";
import { HttpClient } from "../common/clients/HttpClient";
import { TokenRepository } from "./repositories/TokenRepository";
import { CursorRepository } from "./repositories/CursorRepository";
import { FileChangeRepository } from "./repositories/FileChangeRepository";
import { IdentityRepository } from "../common/repositories/IdentityRepository";
import { IdentityService } from "../common/services/IdentityService";

// Repositories
const dynamo = new DynamoClient(process.env.TABLE_PREFIX);
const tokenRepository = new TokenRepository(dynamo);
const cursorRepository = new CursorRepository(dynamo);
const fileChangeRepository = new FileChangeRepository(dynamo);
const identityRepository = new IdentityRepository(dynamo);

const httpClient = new HttpClient();
// Dropbox integration
const dropboxClient = new DropboxClient(
  httpClient,
  process.env.DROPBOX_CLIENT_ID,
  process.env.DROPBOX_CLIENT_SECRET);

const fileUpdateRecorder = new FileUpdateRecorder(
  tokenRepository,
  cursorRepository,
  dropboxClient,
  fileChangeRepository);

// Services
const identityService = new IdentityService(identityRepository);
const notificationService = new NotificationService(fileUpdateRecorder);
const oauthService = new OAuthService(identityService, dropboxClient, tokenRepository, cursorRepository);
const reportService = new ReportService(tokenRepository, dropboxClient, fileChangeRepository);

// Endpoints
export const webhookEndpoint = new WebhookEndpoint(notificationService);
export const oauthEndpoint = new OAuthEndpoint(oauthService);
export const reportEndpoint = new ReportEndpoint(reportService);
