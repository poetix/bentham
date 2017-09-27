import { DynamoClient } from "../../common/clients/DynamoClient";
import { dropboxAccountId, cursor } from "../Api";

export class CursorRepository {

  constructor(readonly dynamo: DynamoClient, readonly tablename: string) {}

  async fetchCursor(accountId: dropboxAccountId): Promise<string> {
    const result = await this.dynamo.get(this.tablename, {
      "account_id": accountId
    });

    return result && result.cursor || undefined;
  }

  saveCursor(accountId: dropboxAccountId, cursor: cursor): Promise<void> {
    return this.dynamo.put(this.tablename, {
      account_id: accountId,
      cursor: cursor
    });
  }
}
