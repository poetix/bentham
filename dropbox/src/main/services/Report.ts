import { accountId } from "../Api";
import { ReportService, UserReport, UserInteractions } from "./ServiceApi";
import { TokenRepository, FileChangeRepository } from "../Repositories";
import { DropboxClient } from "../clients/ClientApi";

function groupBy<V>(arr: V[], f: (value: V) => string): { [key: string]: V[] } {
  const result: { [key: string]: V[] } = {};
  arr.forEach(v => {
    const index = f(v);
    if (!(result[index])) {
      result[index] = [];
    }
    result[index].push(v);
  });
  return result;
}

function mapValues<I, O>(m: { [key: string]: I }, f: (key: string, value: I) => O): { [key: string]: O } {
  const result: { [key: string]: O } = {};

  for (let key in m) {
    console.log(key);
    result[key] = f(key, m[key]);
  };

  return result;
}

export class ConnectedReportService implements ReportService {

  constructor(
    readonly tokens: TokenRepository,
    readonly dropbox: DropboxClient,
    readonly fileChanges: FileChangeRepository) {}

  async getReport(accountId: accountId): Promise<UserReport> {
    const token = await this.tokens.fetchToken(accountId);
    const [userDetails, changes] = await Promise.all([
      this.dropbox.getCurrentAccountDetails(token),
      this.fileChanges.getFileChanges(accountId)]);

    const changesByUserId = groupBy(changes, (change => change["user_id"]));
    const userIds = Object.keys(changesByUserId);
    const userNames = await Promise.all(userIds.map(userId =>
       this.dropbox.getUserDetails(userId, token)
       .then(details => details.userName)));

    const userNameLookup = {};
    for (let i = 0; i < userIds.length; i++) {
      userNameLookup[userIds[i]] = userNames[i];
    }

    const interactions = mapValues<any, UserInteractions>(changesByUserId, (k, v) => (
      { userName: userNameLookup[k], interactions: v.map(change => ({
        timestamp: change.timestamp
      }))}
    ));

    return {
      accountName: userDetails.userName,
      interactions: interactions
    };
  }

}
