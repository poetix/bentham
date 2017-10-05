import { IdentityRepository } from "../repositories/IdentityRepository";
import { slackAccessToken, IdentitySet, SlackIdentity, DropboxIdentity, GithubIdentity, UserToken } from "../Api";
const v4 = require('uuid/v4');

export class IdentityService {

  constructor(private repo: IdentityRepository) {}

  /**
  If you have logged in via Slack, you can create or retrieve a UserToken,
  which includes an access token.
  */
  async grantUserToken(slackIdentity: SlackIdentity): Promise<UserToken> {
    const accessToken = v4();

    await this.repo.saveSlackIdentity(accessToken, slackIdentity);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);
    const githubIdentity = await this.repo.getGithubIdentity(slackIdentity.id);

    return this.constructUserToken(accessToken, slackIdentity, dropboxIdentity);
  }

  /**
  You can then retrieve the UserToken using only the Slack access token,
  for as long as it is valid.
  */
  async getUserToken(slackAccessToken: slackAccessToken): Promise<UserToken> {
    const slackIdentity = await this.repo.getSlackIdentity(slackAccessToken);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);
    const githubIdentity = await this.repo.getGithubIdentity(slackIdentity.id);

    return this.constructUserToken(slackAccessToken, slackIdentity, dropboxIdentity);
  }

  /**
  Retrieves the Slack Identity by Slack access token
  */
  async getSlackIdentity(slackAccessToken: slackAccessToken): Promise<SlackIdentity> {
    return this.repo.getSlackIdentity(slackAccessToken)
  }

  private constructUserToken(slackAccessToken: slackAccessToken, slackIdentity: SlackIdentity, dropboxIdentity?: DropboxIdentity, githubIdentity?: GithubIdentity): UserToken {
    const userToken: UserToken = {
      accessToken: slackAccessToken,
      identities: {
        slack: slackIdentity
      }
    };

    if (dropboxIdentity) {
      userToken.identities.dropbox = dropboxIdentity;
    }

    if (githubIdentity) {
      userToken.identities.github = githubIdentity;
    }

    return userToken;
  }

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and Slack access token to the identity set
  associated with this user.
  */
  async addIdentity<K extends keyof IdentitySet>(slackAccessToken: slackAccessToken, name: K, value: IdentitySet[K]): Promise<UserToken> {
    const slackIdentity = await this.repo.getSlackIdentity(slackAccessToken);
    switch(name) {
      case 'dropbox': {
        await this.repo.saveDropboxIdentity(slackIdentity.id, value as DropboxIdentity);
        return this.constructUserToken(slackAccessToken, slackIdentity, value as DropboxIdentity);
      }
      case 'github': {
        await this.repo.saveGithubIdentity(slackIdentity.id, value as GithubIdentity);
        return this.constructUserToken(slackAccessToken, slackIdentity, undefined, value as GithubIdentity);
      }
      default: {
        throw new Error(`Cannot save identity for service ${name}`);
      }
    }
  }
}
