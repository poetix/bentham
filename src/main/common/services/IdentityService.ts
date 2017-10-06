import { IdentityRepository } from "../repositories/IdentityRepository";
import { slackAccessToken, IdentitySet, SlackIdentity, DropboxIdentity, GithubIdentity, IcarusUserToken } from "../Api";
const v4 = require('uuid/v4');

export class IdentityService {

  constructor(private repo: IdentityRepository) {}


  /**
  If you have logged in via Slack, you can create or retrieve a Icarus User Token Token,
  which includes an access token
  */
  async grantIcarusUserToken(slackIdentity: SlackIdentity): Promise<IcarusUserToken> {
    const accessToken = v4();

    await this.repo.saveSlackIdentity(accessToken, slackIdentity);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);
    const githubIdentity = await this.repo.getGithubIdentity(slackIdentity.id);

    return this.constructIcarusUserToken(accessToken, slackIdentity, dropboxIdentity);
  }

  /**
  Retrieves an Icarus User Token having the Slack access token
  */
  async getIcarusUserToken(slackAccessToken: slackAccessToken): Promise<IcarusUserToken> {
    return this.repo.getSlackIdentity(slackAccessToken)
      .then( slackIdentity =>
          Promise.all([
            this.repo.getDropboxIdentity(slackIdentity.id),
            this.repo.getGithubIdentity(slackIdentity.id)
          ])
          .then( identities => ({
              accessToken: slackIdentity.accessToken,
              userName: slackIdentity.userName,
              dropboxAccountId: (<DropboxIdentity>identities[0]) ?  (<DropboxIdentity>identities[0]).id : undefined,
              githubUsername: (<GithubIdentity>identities[1]) ? (<GithubIdentity>identities[1]).id : undefined
            })
        )
      )
  }


  // FIXME Requires an Icarus Access Token
  private constructIcarusUserToken( slackIdentity: SlackIdentity, dropboxIdentity: DropboxIdentity|undefined, githubIdentity: GithubIdentity|undefined): IcarusUserToken {
    return {
      accessToken: slackIdentity.accessToken,
      userName: slackIdentity.userName,
      dropboxAccountId: dropboxIdentity ? dropboxIdentity.id : undefined,
      githubUsername: githubIdentity ? githubIdentity.id : undefined,
    }
  }

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and access token to the identity set
  associated with this user.
  */
  async addIdentity<K extends keyof IdentitySet>(slackAccessToken: slackAccessToken, name: K, value: IdentitySet[K]): Promise<IcarusUserToken> {
    const slackIdentity = await this.repo.getSlackIdentity(slackAccessToken);
    switch(name) {
      case 'dropbox': {
        return Promise.all([
          this.repo.saveDropboxIdentity(slackIdentity.id, value as DropboxIdentity),
          this.repo.getGithubIdentity(slackIdentity.id)
        ])
        .then( results => this.constructIcarusUserToken(slackIdentity, value as DropboxIdentity, results[1] as GithubIdentity) )
      }
      case 'github': {
        return Promise.all([
          this.repo.getDropboxIdentity(slackIdentity.id),
          this.repo.saveGithubIdentity(slackIdentity.id, value as GithubIdentity)
        ])
        .then( results => this.constructIcarusUserToken(slackIdentity, results[0] as DropboxIdentity, value as GithubIdentity) )
      }
      default: {
        throw new Error(`Cannot save identity for service ${name}`);
      }
    }
  }

}
