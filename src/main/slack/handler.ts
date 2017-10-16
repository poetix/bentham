import { oAuthEndpoint } from "./App";


// OAuth
export const oauthInitiate = (event, context, callback) => oAuthEndpoint.initiate(callback, event);
export const oauthComplete = (event, context, callback) => oAuthEndpoint.complete(callback, event);