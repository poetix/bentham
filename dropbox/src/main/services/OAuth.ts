import { accessCode, uri, accountId, host } from "../Api";
import { OAuthProcessor } from "./ServiceApi";
import { DropboxClient } from "../clients/ClientApi";
import { TokenRepository } from "../Repositories";

export class DropboxOAuthProcessor implements OAuthProcessor {

  constructor(readonly dropbox: DropboxClient, readonly oauthRepository: TokenRepository) {}

  getOAuthUri(host: host): uri {
    return this.dropbox.getOAuthUri(host);
  }

  async processCode(code: accessCode, redirectUri: uri): Promise<accountId> {
    let token = await this.dropbox.requestToken(code, redirectUri);
    await this.oauthRepository.saveToken(token.accountId, token.accessToken);
    return token.accountId;
  };

}
