import { webhookEndpoint, oauthEndpoint } from "./App"


// Webhook
export const webhookReceive = (lambdaProxyEvent, context, callback) => webhookEndpoint.receive(callback, lambdaProxyEvent)

// OAuth
export const oauthInitiate = (event, context, callback) => oauthEndpoint.initiate(callback, event);
export const oauthComplete = (event, context, callback) => oauthEndpoint.complete(callback, event);
