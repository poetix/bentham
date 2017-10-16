import { oAuthEndpoint } from "./App";

// Webhook lambdas
// FIXME add initiate and complete
export const slackLogin = (event, context, cb) => oAuthEndpoint.login(cb, event);
