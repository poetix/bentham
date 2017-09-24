/**
Wires everything together
*/

import { HttpSlackClient } from "./clients/Slack";
import { SlackLoginEndpoint } from "./endpoints/SlackLoginEndpoint";

const slackClient = new HttpSlackClient(
  process.env.SLACK_CLIENT_ID,
  process.env.SLACK_CLIENT_SECRET);

// Endpoints
export const slackLoginEndpoint = new SlackLoginEndpoint(slackClient);
