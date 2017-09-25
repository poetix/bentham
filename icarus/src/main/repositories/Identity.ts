import { DropboxIdentity, icarusAccessToken, SlackIdentity } from "../services/ServiceApi";


export class IdentityRepository {

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
