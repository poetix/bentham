import { accessCode, uri, accountId, host, accessToken, cursor } from "../Api";
import { OAuthProcessor } from "./ServiceApi";
import { DropboxClient } from "../clients/ClientApi";
import { TokenRepository, CursorRepository } from "../Repositories";

export class DropboxOAuthProcessor implements OAuthProcessor {

  constructor(
    readonly dropbox: DropboxClient,
    readonly oauthRepository: TokenRepository,
    readonly cursorRepository: CursorRepository) {}

  getOAuthUri(host: host): uri {
    return this.dropbox.getOAuthUri(host);
  }

  async processCode(code: accessCode, redirectUri: uri): Promise<accountId> {
    let token = await this.dropbox.requestToken(code, redirectUri);
    
    return Promise.all([
      this.oauthRepository.saveToken(token.accountId, token.accessToken),
      this.storeInitialCursor(token.accountId, token.accessToken)
    ]).then(res => token.accountId);
  };

  private async storeInitialCursor(accountId: accountId, token: accessToken): Promise<cursor> {
    const cursor = await this.dropbox.getLatestCursor(accountId, token);
    await this.cursorRepository.saveCursor(accountId, cursor);
    return cursor;
  }

}
