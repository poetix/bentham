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


  private constructIcarusAccessToken(slackAccessToken: slackAccessToken, slackIdentity: SlackIdentity, dropboxIdentity?: DropboxIdentity, githubIdentity?: GithubIdentity): IcarusAccessToken {
    const slackId = slackIdentity.id
    const username = slackIdentity.userName
    const dropboxId = dropboxIdentity ? dropboxIdentity.id : undefined
    const githubUsername = githubIdentity ? githubIdentity.id : undefined

    console.log(`Icarus Access Token: Slack ID=${slackId}, Dropbox ID=${dropboxId}, GitHub username=${githubUsername}`)
    return {
      accessToken: slackAccessToken,
      userName: username,
      dropboxAccountId: dropboxId,
      githubUsername: githubUsername,
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
        return Promise.all([
          this.repo.saveDropboxIdentity(slackIdentity.id, value as DropboxIdentity),
          this.repo.getGithubIdentity(slackIdentity.id)
        ])
        .then( results => this.constructIcarusAccessToken(slackAccessToken, slackIdentity, value as DropboxIdentity, results[1] as GithubIdentity) )
      }
      case 'github': {
        return Promise.all([
          this.repo.getDropboxIdentity(slackIdentity.id),
          this.repo.saveGithubIdentity(slackIdentity.id, value as GithubIdentity)
        ])
        .then( results => this.constructIcarusAccessToken(slackAccessToken, slackIdentity, results[0] as DropboxIdentity, value as GithubIdentity) )
      }
      default: {
        throw new Error(`Cannot save identity for service ${name}`);
      }
    }
  }

}
