import { webhookEndpoint, oauthEndpoint, reportEndpoint, fileChangesEventProcessor } from "./App";

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => webhookEndpoint.challenge(cb, event);
export const webhookNotify = (event, context, cb) => webhookEndpoint.notify(cb, event);

// Oauth lambdas
export const oauthInitiate = (event, context, cb) => oauthEndpoint.initiate(cb, event);
export const oauthComplete = (event, context, cb) => oauthEndpoint.complete(cb, event);

// Report lambdas
export const userReport = (event, context, cb) => reportEndpoint.getReport(cb, event);


// File Changes event processor
// TODO Move into a separate App
export const fileChangesEvents = (event, context, cb) => fileChangesEventProcessor.process(cb, event);