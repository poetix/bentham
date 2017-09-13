/**
Wires everything together
*/

import { DynamoTokenRepository, DynamoCursorRepository, DynamoFileChangeRepository } from "./Repositories";
import { AWSDynamoClient } from "./clients/Dynamo";
import { HttpDropboxClient } from "./clients/Dropbox";

import { DropboxOAuthProcessor } from "./services/OAuth"
import { ConnectedReportService } from "./services/Report"
import { FileUpdateRecordingNotificationProcessor, DropboxFileUpdateRecorder } from "./services/Notifications";

import { WebhookEndpoint } from "./endpoints/WebhookEndpoint";
import { OAuthEndpoint } from "./endpoints/OAuthEndpoint";
import { ReportEndpoint } from "./endpoints/ReportEndpoint";

// Repositories
const dynamo = new AWSDynamoClient();
const tokenRepository = new DynamoTokenRepository(dynamo);
const cursorRepository = new DynamoCursorRepository(dynamo);
const fileChangeRepository = new DynamoFileChangeRepository(dynamo);

// Dropbox integration
const dropboxClient = new HttpDropboxClient(
  process.env.DROPBOX_CLIENT_ID,
  process.env.DROPBOX_CLIENT_SECRET);

const fileUpdateRecorder = new DropboxFileUpdateRecorder(
  tokenRepository,
  cursorRepository,
  dropboxClient,
  fileChangeRepository);

// Services
const notificationProcessor = new FileUpdateRecordingNotificationProcessor(fileUpdateRecorder);
const oauthProcessor = new DropboxOAuthProcessor(dropboxClient, tokenRepository);
const reportService = new ConnectedReportService(tokenRepository, dropboxClient, fileChangeRepository);

// Endpoints
export const webhookEndpoint = new WebhookEndpoint(notificationProcessor);
export const oauthEndpoint = new OAuthEndpoint(oauthProcessor);
export const reportEndpoint = new ReportEndpoint(reportService);
