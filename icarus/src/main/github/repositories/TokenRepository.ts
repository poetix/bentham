import { githubUsername, githubAccessToken } from "../Api";
import { DynamoClient } from "../../common/clients/DynamoClient"

export class TokenRepository {

  constructor(private readonly dynamo: DynamoClient) {}

  saveToken(username: githubUsername, accessToken: githubAccessToken): Promise<void> {
    console.log("Writing account access token to Dynamo");

    return this.dynamo.put("github_tokens", {
      username: username,
      access_token: accessToken
    });
  }

  async fetchToken(username: githubUsername): Promise<githubAccessToken> {
    const result = await this.dynamo.get("github_tokens", {
      "username": username
    });

    return result && result.access_token || undefined;
  }

}
