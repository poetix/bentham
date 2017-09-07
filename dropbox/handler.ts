import { complete } from "./CallbackConversions";
import { pathTo, redirectTo } from "./Http"
import { dropboxOauthUri, processOauthCode } from "./OAuth";
import { processNotification } from "./Notifications"

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => cb(null,
    {
      statusCode: 200,
      body: event.queryStringParameters.challenge
    });

export const webhookNotify = (event, context, cb) => complete(cb,
  processNotification(event.body));

// Oauth lambdas
export const oauthInitiate = (event, context, cb) => cb(null,
  redirectTo(dropboxOauthUri(event)));

export const oauthComplete = (event, context, cb) => complete(
  cb,
  processOauthCode(
    event.queryStringParameters.code,
    pathTo(event, "dropbox-oauth-complete")));
