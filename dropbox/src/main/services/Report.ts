import { accountId, userId, accessToken } from "../Api";
import { ReportService, UserReport, UserInteractions } from "./ServiceApi";
import { TokenRepository, FileChangeRepository } from "../Repositories";
import { DropboxClient } from "../clients/ClientApi";
import { groupBy, mapValues } from "../CollectionUtils";

export class ConnectedReportService implements ReportService {

  constructor(
    readonly tokens: TokenRepository,
    readonly dropbox: DropboxClient,
    readonly fileChanges: FileChangeRepository) {}

  async getReport(accountId: accountId): Promise<UserReport> {
    const [token, changes] = await Promise.all([
      this.tokens.fetchToken(accountId),
      this.fileChanges.getFileChanges(accountId)]);

    const [accountDetails, interactions] = await Promise.all([
      this.dropbox.getCurrentAccountDetails(token),
      this.getInteractions(changes, token)
    ]);

    return {
      accountName: accountDetails.userName,
      interactions: interactions
    };
  }

  private async getInteractions(changes: any[], token: accessToken): Promise<{ [key:string]: UserInteractions }> {
    const changesByUserId = groupBy(changes, (change => change["user_id"]));

    const userNameLookup = await this.getUserNameLookup(Object.keys(changesByUserId), token);

    return mapValues<any, UserInteractions>(changesByUserId, (k, v) => (
      { userName: userNameLookup[k], interactions: v.map(change => ({
        timestamp: change.timestamp
      }))}
    ));
  }

  private async getUserNameLookup(userIds: userId[], token: accessToken): Promise<{ [key:string]: string }> {
    const userNames = await this.getUserNames(userIds, token);

    const userNameLookup = {};
    for (let i = 0; i < userIds.length; i++) {
      userNameLookup[userIds[i]] = userNames[i];
    }

    return userNameLookup;
  }

  private getUserNames(userIds: userId[], token: accessToken): Promise<string[]> {
    return Promise.all(userIds.map(userId =>
       this.dropbox.getUserDetails(userId, token)
       .then(details => details.userName)));
  }

}
