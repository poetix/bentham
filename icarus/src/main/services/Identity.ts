import { icarusAccessToken, SlackIdentity, IdentitySet, UserToken } from "./ServiceApi";

export class IdentityService {
  /**
  If you have logged in via Slack, you can create or retrieve a UserToken,
  which includes an access token.
  */
  async grantUserToken(slackIdentity: SlackIdentity): Promise<UserToken> {
    throw new Error("Not implemented yet");
  }

  /**
  You can then retrieve the UserToken using only the access token,
  for as long as it is valid.
  */
  async getUserToken(accessToken: icarusAccessToken): Promise<UserToken> {
    throw new Error("Not implemented yet");
  }

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and access token to the identity set
  associated with this user.
  */
  async addIdentity<K extends keyof IdentitySet>(accessToken: icarusAccessToken, name: K, value: IdentitySet[K]): Promise<UserToken> {
    throw new Error("Not implemented yet");
  }
}
