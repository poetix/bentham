import { IdentityRepository } from "../repositories/IdentityRepository";
import { slackAccessToken, IdentitySet, SlackIdentity, DropboxIdentity, GithubIdentity, IcarusAccessToken } from "../Api";
const v4 = require('uuid/v4');

export class IdentityService {

  constructor(private repo: IdentityRepository) {}


  /**
  If you have logged in via Slack, you can create or retrieve a IcarusAccessToken,
  which includes a Slack access token
  */
  async grantIcarusAccessToken(slackIdentity: SlackIdentity): Promise<IcarusAccessToken> {
    const accessToken = v4();

    await this.repo.saveSlackIdentity(accessToken, slackIdentity);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);
    const githubIdentity = await this.repo.getGithubIdentity(slackIdentity.id);

    return this.constructIcarusAccessToken(accessToken, slackIdentity, dropboxIdentity);
  }

  /**
  Retrieves an Icarus Access Token having the Slack access token
  */
  async getIcarusAccessToken(slackAccessToken: slackAccessToken): Promise<IcarusAccessToken> {
    const slackIdentity = await this.repo.getSlackIdentity(slackAccessToken);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);
    const githubIdentity = await this.repo.getGithubIdentity(slackIdentity.id);

    return this.constructIcarusAccessToken(slackAccessToken, slackIdentity, dropboxIdentity, githubIdentity);
  }

  /**
  Retrieves the Slack Identity by Slack access token
  */
  async getSlackIdentity(slackAccessToken: slackAccessToken): Promise<SlackIdentity> {
    return this.repo.getSlackIdentity(slackAccessToken)
  }

  private constructIcarusAccessToken(slackAccessToken: slackAccessToken, slackIdentity: SlackIdentity, dropboxIdentity?: DropboxIdentity, githubIdentity?: GithubIdentity): IcarusAccessToken {
    return {
      accessToken: slackAccessToken,
      userName: slackIdentity.userName,
      dropboxAccountId: dropboxIdentity ? dropboxIdentity.id : undefined,
      githubUsername: githubIdentity ? githubIdentity.id : undefined,
    }
  }

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and Slack access token to the identity set
  associated with this user.
  */
  async addIdentity<K extends keyof IdentitySet>(slackAccessToken: slackAccessToken, name: K, value: IdentitySet[K]): Promise<IcarusAccessToken> {
    const slackIdentity = await this.repo.getSlackIdentity(slackAccessToken);
    switch(name) {
      case 'dropbox': {
        await this.repo.saveDropboxIdentity(slackIdentity.id, value as DropboxIdentity);
        return this.constructIcarusAccessToken(slackAccessToken, slackIdentity, value as DropboxIdentity);
      }
      case 'github': {
        await this.repo.saveGithubIdentity(slackIdentity.id, value as GithubIdentity);
        return this.constructIcarusAccessToken(slackAccessToken, slackIdentity, undefined, value as GithubIdentity);
      }
      default: {
        throw new Error(`Cannot save identity for service ${name}`);
      }
    }
  }

}
