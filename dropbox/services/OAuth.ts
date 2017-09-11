import { accessCode, event, uri, response } from "../Api";
import { OAuthProcessor } from "./ServiceApi";
import { DropboxClient } from "../clients/ClientApi";
import { TokenRepository } from "../Repositories";

export class DropboxOAuthProcessor implements OAuthProcessor {

  dropbox: DropboxClient;
  oauthRepository: TokenRepository;

  constructor(dropbox: DropboxClient, oauthRepository: TokenRepository) {
    this.dropbox = dropbox;
    this.oauthRepository = oauthRepository;
  }

  getOAuthUri(event: event): uri {
    return this.dropbox.getOAuthUri(event);
  }

  async processCode(code: accessCode, redirectUri: uri): Promise<response> {
    let token = await this.dropbox.requestToken(code, redirectUri);
    await this.oauthRepository.saveToken(token.accountId, token.accessToken);

    return { statusCode: 200, body: "The application is now authorised" };
  };

}
