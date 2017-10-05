
import { IdentityService } from "../../common/services/IdentityService";
import { GithubClient } from "../clients/GithubClient";
import { TokenRepository } from "../repositories/TokenRepository";
import { slackAccessToken, host, uri, lambdaStage } from "../../common/Api";
import { githubAccessCode, githubUsername, githubAccessToken } from "../Api";

export class OAuthService {
  constructor(
    private readonly identity: IdentityService,
    private readonly github: GithubClient,
    private readonly tokenRepository: TokenRepository) {}

  getOAuthUri(host: host, stage:lambdaStage, slackAccessToken: slackAccessToken): uri {
    return this.github.getOAuthUri(host, stage, slackAccessToken);
  }

  /*
  Processes the GitHub OAuth Access Code:
  - exchanges the Access Code for the Acccess Token
  - retrieves the GitHub Username corresponding to the Access Token
  - stores the Github Access Token along with the Username
  - associates the Github Access Token and Username with the Icarus account
  */
  async processCode(slackAccessToken: slackAccessToken, githubAccessCode: githubAccessCode, redirectUri: uri): Promise<githubUsername> {
    const accessToken = await this.github.requestAccessToken(githubAccessCode, redirectUri);

    const username = await this.github.getUsername(accessToken);

    return Promise.all([
      this.tokenRepository.saveToken(username, accessToken),
      this.identity.addIdentity(slackAccessToken, 'github', {
        id: username,
        accessToken: accessToken
      })
    ]).then(res => username);
  }
}
