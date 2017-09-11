import { clientId, clientSecret, event, uri, accessCode, accountId, accessToken, cursor, fileInfo, accountAccessToken } from "../Api";
import { doHttp, pathTo } from "./Http";
import { CursorRepository } from "../Repositories";
import { DropboxClient, FileFetchResult } from "./ClientApi";

export class HttpDropboxClient implements DropboxClient {


  constructor(
    readonly clientId: clientId,
    readonly clientSecret: clientSecret) {}

  getOAuthUri(event: event): uri {
    return "https://www.dropbox.com/oauth2/authorize?response_type=code" +
    `&client_id=${this.clientId}` +
    `&redirect_uri=${pathTo(event, "dropbox-oauth-complete")}`;
  }

  async requestToken(code: accessCode, redirectUri: uri): Promise<accountAccessToken> {
    console.log(`Requesting user token for code ${code}`);
    const responseBody = await doHttp({
      url: 'https://api.dropboxapi.com/oauth2/token',
      method: 'POST',
      form: {
        code: code,
        grant_type: "authorization_code",
        client_id: process.env.DROPBOX_CLIENT_ID,
        client_secret: process.env.DROPBOX_CLIENT_SECRET,
        redirect_uri: redirectUri
      }
    });

    const response = JSON.parse(responseBody);

     console.log(`Received access token ${response.access_token} for user ${response.account_id}`);
     return {
       accessToken: response.access_token,
       accountId: response.account_id
     };
   }

  async fetchFiles(accountId: accountId, token: accessToken, cursor: cursor | null): Promise<FileFetchResult> {
    console.log(`Fetching files for account ${accountId}, using token ${token}`);

    var result = await this.getInitial(token, cursor);

    var entries = result.entries;
    while (result.has_more) {
      console.log(`Fetching more files at cursor ${result.cursor}`);

      result = await this.listFolderContinue(token, result.cursor);
      entries = entries.concat(result.entries);
    }

    console.log("Fetched all files");

    return {
      files: entries,
      newCursor: result.cursor
    };
  }

  getInitial(token: accessToken, cursor: cursor | null): Promise<any> {
    if (cursor == null) {
      return this.listFolder(token)
    } else {
      return this.listFolderContinue(token, cursor);
    }
  }

  listFolder(token: accessToken): Promise<any> {
    return doHttp({
      url: 'https://api.dropboxapi.com/2/files/list_folder',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: {
        path: "",
        recursive: true,
        include_media_info: true,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true
      }
    });
  }

  listFolderContinue(token: string, cursor: string): Promise<any> {
    return doHttp({
      url: 'https://api.dropboxapi.com/2/files/list_folder/continue',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: {
        cursor: cursor
      }
    });
  }
}
