import { oAuthEndpoint, identityEndpoint } from "./App";


// OAuth
export const oauthInitiate = (event, context, callback) => oAuthEndpoint.initiate(callback, event);
export const oauthComplete = (event, context, callback) => oAuthEndpoint.complete(callback, event);

// Identity management
export const forgetMe = (event, context, callback) => identityEndpoint.forgetMe(callback, event)