import { accountId } from "../Api";
import { ReportService, UserReport } from "./ServiceApi";
import { TokenRepository, FileChangeRepository } from "../Repositories";
import { DropboxClient } from "../clients/ClientApi";

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

    return {
      userName: userDetails.userName,
      interactions: changes.map(change => change.timestamp)
    };
  }

}
