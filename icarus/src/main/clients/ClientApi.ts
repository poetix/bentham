import { event, uri, slackAuthCode, slackToken } from "../Api";

export interface SlackClient {
  getToken(code: slackAuthCode): Promise<slackToken>
  getUserDetails(token: slackToken): Promise<any>
}
