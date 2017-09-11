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

    if (token == null) {
      console.log(`No token for account ${accountId}`);
      return; // bomb out early
    }

    const {files, newCursor} = await this.dropbox.fetchFiles(accountId, token, cursor);
    if (newCursor != null) {
      await this.cursorRepository.saveCursor(accountId, newCursor);
    }

    const fileList = files.filter(entry => entry.client_modified);

    if (fileList.length > 0) {
      await this.fileChangeRepository.saveFileChanges(accountId, fileList);
    }

    console.log("Done");
  }
}
