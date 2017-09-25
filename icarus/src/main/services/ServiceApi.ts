/*
This is the identity service, which manages user identity and access tokens.

It is so central to everything else that it's almost worth pulling out into its own npm module.
Perhaps we'll do that later.
*/
export interface AppIdentity {
  id: string,
  accessToken: string
}

export interface SlackIdentity extends AppIdentity {
  teamId: string,
  userName: string
}

export type DropboxIdentity = AppIdentity;

export interface IdentitySet {
  slack: SlackIdentity,
  dropbox?: DropboxIdentity,
  // Other app identities go here
}

export type icarusAccessToken = string;

export interface UserToken {
  accessToken: icarusAccessToken,
  identities: IdentitySet
}
