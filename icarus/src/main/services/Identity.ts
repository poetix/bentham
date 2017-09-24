/*
This is the identity service, which manages user identity and access tokens.

It is so central to everything else that it's almost worth pulling out into its own npm module.
Perhaps we'll do that later.
*/
export type AppIdentity = {
  id: string,
  accessToken: string
}

export type SlackIdentity = AppIdentity;
export type DropboxIdentity = AppIdentity;

export type IdentitySet = {
  slack: SlackIdentity,
  dropbox?: DropboxIdentity,
  // Other app identities go here
}

export type UserToken = {
  accessToken: string,
  identities: IdentitySet
}

export interface IdentityService {
  /**
  If you have logged in via Slack, you can create or retrieve a UserToken,
  which includes an access token.
  */
  grantUserToken(slackIdentity: SlackIdentity): Promise<UserToken>

  /**
  You can then retrieve the UserToken using only the access token,
  for as long as it is valid.
  */
  getUserToken(accessToken: string): Promise<UserToken>

  /**
  Services which connect Icarus to other apps use this method
  to add an app's user id and access token to the identity set
  associated with this user.
  */
  addIdentity<K extends keyof IdentitySet>(accessToken: string, name: K, value: IdentitySet[K]): Promise<UserToken>
}
