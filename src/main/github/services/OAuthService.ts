
import { IdentityService } from "../../common/services/IdentityService";
import { GithubClient } from "../clients/GithubClient";
import { icarusAccessToken, host, uri, lambdaStage, IcarusUserToken } from "../../common/Api";
import { githubAuthorisationCode, githubUsername, githubAccessToken } from "../Api";

export class OAuthService {
  constructor(
    private readonly identity: IdentityService,
    private readonly github: GithubClient) {}

  getOAuthAuthoriseUri(icarusAccessToken:icarusAccessToken, returnUri:uri): uri {
    return this.github.getOAuthAuthoriseUri(icarusAccessToken, returnUri);
  }

  /*
  Processes the GitHub OAuth Access Code:
  - exchanges the Access Code for the Acccess Token
  - retrieves the GitHub Username corresponding to the Access Token
  - associates the Github Access Token and Username with the Icarus account
  */
  async processCode(icarusAccessToken: icarusAccessToken, githubAuthorisationCode: githubAuthorisationCode, redirectUri: uri): Promise<IcarusUserToken> {
    const accessToken = await this.github.requestAccessToken(githubAuthorisationCode, redirectUri);

    const username = await this.github.getUsername(accessToken);

    return this.identity.addIdentity(icarusAccessToken, 'github', {
      id: username,
      accessToken: accessToken
    }).then( icarusAccessToken => icarusAccessToken )

  }
}
