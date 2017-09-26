import { DropboxIdentity, icarusAccessToken, SlackIdentity } from "../Api";

export class IdentityRepository {

  saveDropboxIdentity(accessToken: icarusAccessToken, dropboxIdentity: DropboxIdentity): any {
    throw new Error("Method not implemented.");
  }

  saveSlackIdentity(accessToken: icarusAccessToken, slackIdentity: SlackIdentity): Promise<void> {
    throw new Error("Not implemented yet");
  }

  getSlackIdentity(accessToken: icarusAccessToken): Promise<SlackIdentity> {
    throw new Error("Not implemented yet");
  }

  getDropboxIdentity(slackId: string): Promise<DropboxIdentity | undefined> {
    throw new Error("Not implemented yet");
  }

}
