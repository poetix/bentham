import { IdentityService } from "../../common/services/IdentityService";
import { DropboxClient } from "../clients/DropboxClient";
import { TokenRepository } from "../repositories/TokenRepository";
import { CursorRepository } from "../repositories/CursorRepository";
import { icarusAccessToken, host, uri } from "../../common/Api";
import { dropboxAccessCode, dropboxAccountId, dropboxAccessToken, cursor } from "../Api";

export class OAuthService {

  constructor(
    private readonly identity: IdentityService,
    private readonly dropbox: DropboxClient,
    private readonly tokenRepository: TokenRepository,
    private readonly cursorRepository: CursorRepository) {}

  getOAuthUri(host: host, icarusAccessToken: icarusAccessToken): uri {
    return this.dropbox.getOAuthUri(host, icarusAccessToken);
  }

  /**
  This has quite a lot of work to do:
  - it uses the supplied Dropbox access code to obtain an Dropbox API token.
  - it stores the Dropbox API token in the token repository, so it can be used
    when processing future notifications via the Dropbox webhook.
  - it obtains and stores an initial cursor for the account, so that files that
    existed before registration are not scanned for their update timestamps.
  - it associates the Dropbox account id and access token with the Icarus account.
   */
  async processCode(icarusAccessToken: icarusAccessToken, dropboxAccessCode: dropboxAccessCode, redirectUri: uri): Promise<dropboxAccountId> {
    const token = await this.dropbox.requestToken(dropboxAccessCode, redirectUri);

    return Promise.all([
      this.tokenRepository.saveToken(token.accountId, token.accessToken),
      this.storeInitialCursor(token.accountId, token.accessToken),
      this.identity.addIdentity(icarusAccessToken, 'dropbox', {
        id: token.accountId,
        accessToken: token.accessToken
      })
    ]).then(res => token.accountId);
  };

  private async storeInitialCursor(accountId: dropboxAccountId, token: dropboxAccessToken): Promise<cursor> {
    const cursor = await this.dropbox.getLatestCursor(accountId, token);
    await this.cursorRepository.saveCursor(accountId, cursor);
    return cursor;
  }

}
