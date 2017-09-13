import { accountAccessToken, event, accessCode, uri, accountId, accessToken, cursor, fileInfo } from "../Api";

/**
A class that either is, or is pretending to be, DynamoDB, wrapping callbacks as Promises.
*/
export interface DynamoClient {
  /**
  Put an item into DynamoDB.
  */
  put(tableName: string, item: any): Promise<any>
  /**
  Get an item from DynamoDB.
  */
  get(tableName: string, key: any): Promise<any>
  /**
  Perform multiple writes in DynamoDB.
  */
  putAll(tableName: string, items: Array<any>): Promise<any>

}

export interface FileFetchResult {
  files: Array<fileInfo>
  newCursor?: cursor
}

export interface UserDetails {
  userName: string
}

export interface DropboxClient {

  getOAuthUri(event: event): string;

  requestToken(code: accessCode, redirectUri: uri): Promise<accountAccessToken>

  fetchFiles(accountId: accountId, token: accessToken, cursor?: cursor): Promise<FileFetchResult>

  getUserDetails(accountId: accountId, token: accessToken): Promise<UserDetails>

}
