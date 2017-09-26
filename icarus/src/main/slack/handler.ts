import { slackLoginEndpoint } from "./App";

// Webhook lambdas
export const slackLogin = (event, context, cb) => slackLoginEndpoint.login(cb, event);
