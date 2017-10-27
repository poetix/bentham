import { webhookEndpoint, oauthEndpoint, reportEndpoint } from "./App";

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => webhookEndpoint.challenge(cb, event);
export const webhookNotify = (event, context, cb) => webhookEndpoint.notify(cb, event);

// Oauth lambdas
export const oauthInitiate = (event, context, cb) => oauthEndpoint.initiate(cb, event);
export const oauthComplete = (event, context, cb) => oauthEndpoint.complete(cb, event);

// Report lambdas
// TODO This report is obsolete
export const userReport = (event, context, cb) => reportEndpoint.getReport(cb, event);
