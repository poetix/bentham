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
      this.dropbox.getUserDetails(accountId, token),
      this.fileChanges.getFileChanges(accountId)]);

    const changesByUserId = groupBy(changes, (change => change["user_id"]));
    const interactions = mapValues<any, UserInteractions>(changesByUserId, (k, v) => (
      { userName: "tbd", interactions: v.map(change => ({
        timestamp: change.timestamp
      }))}
    ));

    return {
      accountName: userDetails.userName,
      interactions: interactions
    };
  }

}
