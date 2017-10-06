import { IdentityService } from "../../common/services/IdentityService";
import { DropboxClient } from "../clients/DropboxClient";
import { TokenRepository } from "../repositories/TokenRepository";
import { CursorRepository } from "../repositories/CursorRepository";
import { slackAccessToken, host, uri, lambdaStage, IcarusAccessToken } from "../../common/Api";
import { dropboxAuthorisationCode, dropboxAccountId, dropboxAccessToken, cursor } from "../Api";

export class OAuthService {

  constructor(
    private readonly identity: IdentityService,
    private readonly dropbox: DropboxClient,
    private readonly tokenRepository: TokenRepository,
    private readonly cursorRepository: CursorRepository) {}

  getOAuthUri(host: host, stage:lambdaStage, slackAccessToken: slackAccessToken, returnUri:uri): uri {
    return this.dropbox.getOAuthUri(host, stage, slackAccessToken, returnUri);
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
  async processCode(slackAccessToken: slackAccessToken, dropboxAuthorisationCode: dropboxAuthorisationCode, accessCodeRequestRedirectUri:uri): Promise<IcarusAccessToken> {
    // Redirect uri is passed for verification only
    const token = await this.dropbox.requestToken(dropboxAuthorisationCode, accessCodeRequestRedirectUri);

    return Promise.all([
      this.tokenRepository.saveToken(token.accountId, token.accessToken),
      this.storeInitialCursor(token.accountId, token.accessToken),
      this.identity.addIdentity(slackAccessToken, 'dropbox', {
        id: token.accountId,
        accessToken: token.accessToken
      })
    ]).then(res => res[2]); // Returning only the IcarusAccessToken from IdentityService.addIdentity
  };

  private async storeInitialCursor(accountId: dropboxAccountId, token: dropboxAccessToken): Promise<cursor> {
    const cursor = await this.dropbox.getLatestCursor(accountId, token);
    await this.cursorRepository.saveCursor(accountId, cursor);
    return cursor;
  }

}
