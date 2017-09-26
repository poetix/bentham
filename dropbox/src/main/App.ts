/**
Wires everything together
*/

import { DynamoTokenRepository, DynamoCursorRepository, DynamoFileChangeRepository } from "./Repositories";
import { DynamoClient } from "./clients/Dynamo";
import { DropboxClient } from "./clients/Dropbox";

import { OAuthService } from "./services/OAuth"
import { ReportService } from "./services/Report"
import { NotificationService, FileUpdateRecorder } from "./services/Notifications";

import { WebhookEndpoint } from "./endpoints/WebhookEndpoint";
import { OAuthEndpoint } from "./endpoints/OAuthEndpoint";
import { ReportEndpoint } from "./endpoints/ReportEndpoint";
import { HttpClient } from "./clients/Http";

// Repositories
const dynamo = new DynamoClient();
const tokenRepository = new DynamoTokenRepository(dynamo);
const cursorRepository = new DynamoCursorRepository(dynamo);
const fileChangeRepository = new DynamoFileChangeRepository(dynamo);

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
const notificationService = new NotificationService(fileUpdateRecorder);
const oauthService = new OAuthService(dropboxClient, tokenRepository, cursorRepository);
const reportService = new ReportService(tokenRepository, dropboxClient, fileChangeRepository);

// Endpoints
export const webhookEndpoint = new WebhookEndpoint(notificationService);
export const oauthEndpoint = new OAuthEndpoint(oauthService);
export const reportEndpoint = new ReportEndpoint(reportService);
