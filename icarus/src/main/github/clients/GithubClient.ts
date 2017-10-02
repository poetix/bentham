import { HttpClient, pathTo } from "../../common/clients/HttpClient";
import { icarusAccessToken, host, uri } from "../../common/Api";
import { githubClientId, gihubClientSecret, githubAccessCode, githubAccessToken, githubUsername } from "../Api"

export class GithubClient {
  constructor(
    private readonly http: HttpClient,
    private readonly clientId: githubClientId,
    private readonly clientSecret: gihubClientSecret) {}

    getOAuthUri(host: host, icarusAccessToken: icarusAccessToken): uri {
      return  'https://github.com/login/oauth/authorize' +
      `&client_id=${this.clientId}` +
      `&redirect_uri=${pathTo(host, "github-oauth-complete")}` +
      `&state=${icarusAccessToken}`;
    }

    async requestAccessToken(code: githubAccessCode, redirectUri: uri): Promise<githubAccessToken> {
      console.log(`Requesting user token for code ${code}`);
      // FIXME
      const responseBody = await this.http.doHttp({
        url: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        form: {
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: redirectUri
        }
      });
      const response = JSON.parse(responseBody);

      console.log(`Received access token ${response.access_token}`);
      return response.access_token;
    }

    async getUsername(accessToken: githubAccessToken): Promise<githubUsername> {
      console.log('Fetching Github user account ID');

      const responseBody = await this.http.doHttp({
        url: 'https://api.github.com/user',
        method: 'GET',
        headers: {
          'Authorization': `token ${accessToken}`,
        },
      });

      const response = JSON.parse(responseBody);

      console.log(`Retrieved username: ${response.login}`);
      return response.login;
    }
}
