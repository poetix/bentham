import { DynamoClient } from "./clients/ClientApi"

export interface TokenRepository {
  fetchToken(accountId: string): Promise<string>
  saveToken(accountId: string, accessToken: string): Promise<void>
}

export interface CursorRepository {
  fetchCursor(accountId: string): Promise<string>
  saveCursor(accountId: string, cursor: string): Promise<void>
}

export interface FileChangeRepository {
  saveFileChanges(accountId: string, fileList: Array<any>): Promise<void>;
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

  async fetchToken(accountId: string): Promise<string> {
    const result = await this.dynamo.get("user_tokens", {
      "account_id": accountId
    });

    return result && result.access_token || undefined;
  }

}

export class DynamoCursorRepository implements CursorRepository {

  constructor(readonly dynamo: DynamoClient) {}

  async fetchCursor(accountId: string): Promise<string> {
    const result = await this.dynamo.get("user_cursors", {
      "account_id": accountId
    });

    return result && result.cursor || undefined;
  }

  saveCursor(accountId: string, cursor: string): Promise<void> {
    return this.dynamo.put('user_cursors', {
      account_id: accountId,
      cursor: cursor
    });
  }
}

export class DynamoFileChangeRepository {

  constructor(readonly dynamo: DynamoClient) {}

  saveFileChanges(accountId: string, fileList: Array<any>): Promise<void> {
    const items = fileList.map(entry => ({
      "account_id": accountId,
      timestamp: entry.client_modified,
      type: entry[".tag"]
    }));

    console.log("Writing items to DynamoDB");
    return this.dynamo.putAll("file_changes", items);
  }
}
