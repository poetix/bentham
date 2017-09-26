import { accountId, event, accessCode, uri, response, slackAuthCode } from "../Api";

export interface ListFolder {
  accounts: Array<string>
}

export interface Delta {
  users: Array<number>
}

export interface Notification {
  list_folder: ListFolder,
  delta: Delta
}

export interface UserInteractions {
  userName: string,
  interactions: string[]
}

export interface UserReport {
  accountName: string,
  interactions: { [key: string]: UserInteractions }
}

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

export interface UserToken {
  accessToken: string,
  identities: IdentitySet
}
