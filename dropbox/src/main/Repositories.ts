import { accountId, accessToken, cursor } from "./Api";
import { DynamoClient, DynamoWritePager } from "./clients/Dynamo"

export class TokenRepository {

  constructor(readonly dynamo: DynamoClient) {}

  saveToken(accountId: string, accessToken: string): Promise<void> {
    console.log("Writing account access token to Dynamo");

    return this.dynamo.put('user_tokens', {
      account_id: accountId,
      access_token: accessToken
    });
  }

  async fetchToken(accountId: accountId): Promise<string> {
    const result = await this.dynamo.get("user_tokens", {
      "account_id": accountId
    });

    return result && result.access_token || undefined;
  }

}

export class CursorRepository {

  constructor(readonly dynamo: DynamoClient) {}

  async fetchCursor(accountId: accountId): Promise<string> {
    const result = await this.dynamo.get("user_cursors", {
      "account_id": accountId
    });

    return result && result.cursor || undefined;
  }

  saveCursor(accountId: accountId, cursor: cursor): Promise<void> {
    return this.dynamo.put('user_cursors', {
      account_id: accountId,
      cursor: cursor
    });
  }
}

export class FileChangeRepository {

  pager: DynamoWritePager;

  constructor(readonly dynamo: DynamoClient) {
    this.pager = new DynamoWritePager(dynamo);
  }

  async saveFileChanges(accountId: accountId, changeList: Array<any>): Promise<void> {
    const items = changeList.map(entry => ({
      "account_id": accountId,
      "user_id": entry.modifiedBy,
      timestamp: entry.modifiedAt,
      type: entry.tag
    }));

    console.log(`Writing items to DynamoDB for account ${accountId}`);
    console.log(changeList);
    this.pager.putAll("file_changes", items);
  }

  async getFileChanges(accountId: accountId): Promise<Array<any>> {
    return this.dynamo.query({
      TableName: 'file_changes',
      KeyConditionExpression: 'account_id = :hkey',
      ExpressionAttributeValues: {
        ':hkey': accountId
      }
    });
  }
}
