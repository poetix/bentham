import { event, uri, slackAuthCode, slackToken } from "../Api";

import { HttpClient } from './Http';

export class SlackClient {

  constructor(private http: HttpClient, private clientId: string, private clientSecret: string) {}

  async getToken(code: slackAuthCode): Promise<slackToken> {
    console.log(`Fetching token with code ${code}`);

    const response = await this.http.doHttp({
      url: "https://slack.com/api/oauth.access",
      method: "get",
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code
      }
    });

    return JSON.parse(response).access_token;
  }

  async getUserDetails(token: slackToken): Promise<any> {
    console.log(`Fetching user details with token ${token}`);

    const responseBody = await this.http.doHttp({
      url: "https://slack.com/api/users.identity",
      method: "get",
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: token
      }
    });

    const response = JSON.parse(responseBody);
    if (!response.ok) {
      throw new Error("Response not OK");
    }

    return response;
  }

}
