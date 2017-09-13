import { accountId, accessToken, cursor } from "./Api";
import { DynamoClient, DynamoWritePager } from "./clients/ClientApi"

export interface TokenRepository {
  fetchToken(accountId: accountId): Promise<string>
  saveToken(accountId: accountId, accessToken: accessToken): Promise<void>
}

export interface CursorRepository {
  fetchCursor(accountId: accountId): Promise<string>
  saveCursor(accountId: accountId, cursor: cursor): Promise<void>
}

export interface FileChangeRepository {
  saveFileChanges(accountId: accountId, fileList: Array<any>): Promise<void>;
  getFileChanges(accountId: accountId): Promise<Array<any>>
}

export class DynamoTokenRepository implements TokenRepository {

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

export class DynamoCursorRepository implements CursorRepository {

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

export class DynamoFileChangeRepository {

  pager: DynamoWritePager;

  constructor(readonly dynamo: DynamoClient) {
    this.pager = new DynamoWritePager(dynamo);
  }

  async saveFileChanges(accountId: accountId, fileList: Array<any>): Promise<void> {
    const items = fileList.map(entry => ({
      "account_id": accountId,
      timestamp: entry.client_modified,
      type: entry[".tag"]
    }));

    console.log("Writing items to DynamoDB");
    this.pager.putAll("file_changes", items);
  }

  async getFileChanges(accountId: accountId): Promise<Array<any>> {
    return [];
  }
}
