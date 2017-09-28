import { IdentityRepository } from "../repositories/IdentityRepository";
import { icarusAccessToken, IdentitySet, SlackIdentity, DropboxIdentity, UserToken } from "../API";
const v4 = require('uuid/v4');

export class IdentityService {

  constructor(private repo: IdentityRepository) {}

  /**
  If you have logged in via Slack, you can create or retrieve a UserToken,
  which includes an access token.
  */
  async grantUserToken(slackIdentity: SlackIdentity): Promise<UserToken> {
    const accessToken = v4();

    //await this.repo.saveSlackIdentity(accessToken, slackIdentity);
    //const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);

    const dropboxIdentity = undefined;
    return this.constructUserToken(accessToken, slackIdentity, dropboxIdentity);
  }

  /**
  You can then retrieve the UserToken using only the access token,
  for as long as it is valid.
  */
  async getUserToken(accessToken: icarusAccessToken): Promise<UserToken> {
    const slackIdentity = await this.repo.getSlackIdentity(accessToken);
    const dropboxIdentity = await this.repo.getDropboxIdentity(slackIdentity.id);

    return this.constructUserToken(accessToken, slackIdentity, dropboxIdentity);
  }

  private constructUserToken(accessToken: icarusAccessToken, slackIdentity: SlackIdentity, dropboxIdentity?: DropboxIdentity): UserToken {
    const userToken: UserToken = {
      accessToken: accessToken,
      identities: {
        slack: slackIdentity
      }
    };

    if (dropboxIdentity) {
      userToken.identities.dropbox = dropboxIdentity;
    }

    return userToken;
  }

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and access token to the identity set
  associated with this user.
  */
  async addIdentity<K extends keyof IdentitySet>(accessToken: icarusAccessToken, name: K, value: IdentitySet[K]): Promise<UserToken> {
    const slackIdentity = await this.repo.getSlackIdentity(accessToken);
    switch(name) {
      case 'dropbox': {
        await this.repo.saveDropboxIdentity(slackIdentity.id, value as DropboxIdentity);
        return this.constructUserToken(accessToken, slackIdentity, value as DropboxIdentity);
      }
      default: {
        throw new Error(`Cannot save identity for service ${name}`);
      }
    }
  }
}
