
import { IdentityService } from "../../common/services/IdentityService";
import { GithubClient } from "../clients/GithubClient";
import { TokenRepository } from "../repositories/TokenRepository";
import { slackAccessToken, host, uri, lambdaStage, IcarusUserToken } from "../../common/Api";
import { githubAuthorisationCode, githubUsername, githubAccessToken } from "../Api";

export class OAuthService {
  constructor(
    private readonly identity: IdentityService,
    private readonly github: GithubClient,
    private readonly tokenRepository: TokenRepository) {}

  getOAuthUri(host: host, stage:lambdaStage, slackAccessToken: slackAccessToken, returnUri:uri): uri {
    return this.github.getOAuthUri(host, stage, slackAccessToken, returnUri);
  }

  /*
  Processes the GitHub OAuth Access Code:
  - exchanges the Access Code for the Acccess Token
  - retrieves the GitHub Username corresponding to the Access Token
  - stores the Github Access Token along with the Username
  - associates the Github Access Token and Username with the Icarus account
  */
  async processCode(slackAccessToken: slackAccessToken, githubAuthorisationCode: githubAuthorisationCode, redirectUri: uri): Promise<IcarusUserToken> {
    const accessToken = await this.github.requestAccessToken(githubAuthorisationCode, redirectUri);

    const username = await this.github.getUsername(accessToken);

    return Promise.all([
      this.tokenRepository.saveToken(username, accessToken),
      this.identity.addIdentity(slackAccessToken, 'github', {
        id: username,
        accessToken: accessToken
      })
    ]).then(res => res[1]); // Returning the IcarusUserToken from IdentityService.addIdentity
  }
}
