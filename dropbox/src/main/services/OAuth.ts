import { accessCode, event, uri, response } from "../Api";
import { OAuthProcessor } from "./ServiceApi";
import { DropboxClient } from "../clients/ClientApi";
import { TokenRepository } from "../Repositories";

export class DropboxOAuthProcessor implements OAuthProcessor {

  constructor(readonly dropbox: DropboxClient, readonly oauthRepository: TokenRepository) {}

  getOAuthUri(event: event): uri {
    return this.dropbox.getOAuthUri(event);
  }

  async processCode(code: accessCode, redirectUri: uri): Promise<void> {
    let token = await this.dropbox.requestToken(code, redirectUri);
    await this.oauthRepository.saveToken(token.accountId, token.accessToken);
  };

}
