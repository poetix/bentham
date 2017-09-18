import { accountId } from "../Api";
import { NotificationProcessor, FileUpdateRecorder, Notification } from "./ServiceApi";
import { TokenRepository, CursorRepository, FileChangeRepository } from "../Repositories";
import { DropboxClient } from "../clients/ClientApi";

export class FileUpdateRecordingNotificationProcessor implements NotificationProcessor {

  constructor(readonly fileUpdateRecorder: FileUpdateRecorder) {}

  async processNotification(notification: Notification): Promise<void> {
    console.log("Recording file updates for accounts: " + notification.list_folder.accounts);
    await Promise.all(notification.list_folder.accounts.map(account => this.fileUpdateRecorder.recordUpdates(account)));
  }
}

export class DropboxFileUpdateRecorder implements FileUpdateRecorder {

  constructor(
    readonly tokenRepository: TokenRepository,
    readonly cursorRepository: CursorRepository,
    readonly dropbox: DropboxClient,
    readonly fileChangeRepository: FileChangeRepository
  ) {}

  async recordUpdates(accountId: accountId): Promise<void> {
    console.log(`Fetching updates for account ${accountId}`);
    const [token, cursor] = await Promise.all([
      this.tokenRepository.fetchToken(accountId),
      this.cursorRepository.fetchCursor(accountId)
    ]);

    if (!token) {
      console.log(`No token for account ${accountId}`);
      return; // bomb out early
    }

    const {files, newCursor} = await this.dropbox.fetchFiles(accountId, token, cursor);
    const promises: Promise<any>[] = [];
    if (newCursor) {
      promises.push(this.cursorRepository.saveCursor(accountId, newCursor));
    }

    const fileList = files.filter(entry => entry.client_modified).map(entry => ({
      modifiedAt: entry.server_modified,
      modifiedBy: entry["sharing_info"] && entry["sharing_info"]["modified_by"] || accountId,
      tag: entry[".tag"]
    }));

    if (fileList.length > 0) {
      promises.push(this.fileChangeRepository.saveFileChanges(accountId, fileList));
    }

    await Promise.all(promises);
    console.log("Done");
  }
}
