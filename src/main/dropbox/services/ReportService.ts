import { dropboxAccountId, dropboxUserId, dropboxAccessToken } from "../Api";
import { DropboxClient } from "../clients/DropboxClient";
import { groupBy, mapValues } from "../../common/CollectionUtils";
import { icarusAccessToken } from "../../common/Api";
import { TokenRepository } from "../repositories/TokenRepository";
import { FileChangeRepository } from "../repositories/FileChangeRepository";
import { IdentityService } from "../../common/services/IdentityService"

export interface UserInteractions {
  userName: string,
  interactions: string[]
}

export interface UserReport {
  accountName: string,
  interactions: { [key: string]: UserInteractions }
}

export class ReportService {

  constructor(
    private readonly tokens: TokenRepository,
    private readonly dropbox: DropboxClient,
    private readonly fileChanges: FileChangeRepository,
    private readonly identity: IdentityService 
  ) {}

  async getReport(icarusAccessToken: icarusAccessToken): Promise<UserReport> {
    const dropboxAccountId = (await this.identity.getDropboxIdentity(icarusAccessToken)).id

    const [token, changes] = await Promise.all([
      this.tokens.fetchToken(dropboxAccountId),
      this.fileChanges.getFileChanges(dropboxAccountId)]);

    const [accountDetails, interactions] = await Promise.all([
      this.dropbox.getCurrentAccountDetails(token),
      this.getInteractions(changes, token)
    ]);

    return {
      accountName: accountDetails.userName,
      interactions: interactions
    };
  }

  private async getInteractions(changes: any[], token: dropboxAccessToken): Promise<{ [key:string]: UserInteractions }> {
    const changesByUserId = groupBy(changes, (change => change["user_id"]));

    const userNameLookup = await this.getUserNameLookup(Object.keys(changesByUserId), token);

    return mapValues<any, UserInteractions>(changesByUserId, (k, v) => (
      { userName: userNameLookup[k], interactions: v.map(change => ({
        timestamp: change.timestamp
      }))}
    ));
  }

  private async getUserNameLookup(userIds: dropboxUserId[], token: dropboxAccessToken): Promise<{ [key:string]: string }> {
    const userNames = await this.getUserNames(userIds, token);

    const userNameLookup = {};
    for (let i = 0; i < userIds.length; i++) {
      userNameLookup[userIds[i]] = userNames[i];
    }

    return userNameLookup;
  }

  private getUserNames(userIds: dropboxUserId[], token: dropboxAccessToken): Promise<string[]> {
    return Promise.all(userIds.map(userId =>
       this.dropbox.getUserDetails(userId, token)
       .then(details => details.userName)));
  }

}
