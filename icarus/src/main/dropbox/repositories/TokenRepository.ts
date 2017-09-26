import { dropboxAccountId, dropboxAccessToken, cursor } from "../Api";
import { DynamoClient } from "../../common/clients/DynamoClient"

export class TokenRepository {

  constructor(readonly dynamo: DynamoClient) {}

  saveToken(accountId: dropboxAccountId, accessToken: dropboxAccessToken): Promise<void> {
    console.log("Writing account access token to Dynamo");

    return this.dynamo.put('user_tokens', {
      account_id: accountId,
      access_token: accessToken
    });
  }

  async fetchToken(accountId: dropboxAccountId): Promise<dropboxAccessToken> {
    const result = await this.dynamo.get("user_tokens", {
      "account_id": accountId
    });

    return result && result.access_token || undefined;
  }

}
