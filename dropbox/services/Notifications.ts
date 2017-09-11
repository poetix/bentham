import { accountId } from "../Api";
import { NotificationProcessor, FileUpdateRecorder, Notification } from "./ServiceApi";
import { TokenRepository, CursorRepository, FileChangeRepository } from "../Repositories";
import { DropboxClient } from "../clients/ClientApi";

export class FileUpdateRecordingNotificationProcessor implements NotificationProcessor {

  fileUpdateRecorder: FileUpdateRecorder;

  constructor(fileUpdateRecorder: FileUpdateRecorder) {
    this.fileUpdateRecorder = fileUpdateRecorder;
  }

  async processNotification(notification: Notification): Promise<void> {
    await Promise.all(notification.list_folder.accounts.map(this.fileUpdateRecorder.recordUpdates));
  }
}

export class DropboxFileUpdateRecorder implements FileUpdateRecorder {

  tokenRepository: TokenRepository;
  cursorRepository: CursorRepository;
  dropbox: DropboxClient;
  fileChangeRepository: FileChangeRepository;

  constructor(
    tokenRepository: TokenRepository,
    cursorRepository: CursorRepository,
    dropbox: DropboxClient,
    fileChangeRepository: FileChangeRepository
  ) {
      this.tokenRepository = tokenRepository;
      this.cursorRepository = cursorRepository;
      this.dropbox = dropbox;
      this.fileChangeRepository = fileChangeRepository;
  }

  async recordUpdates(accountId: accountId): Promise<void> {
    const [token, cursor] = await Promise.all([
      this.tokenRepository.fetchToken(accountId),
      this.cursorRepository.fetchCursor(accountId)
    ]);

    if (token == null) {
      console.log(`No token for account ${accountId}`);
      return; // bomb out early
    }

    const fileList = (await this.dropbox.fetchFiles(accountId, token, cursor))
      .filter(entry => entry.client_modified);

    if (fileList.length > 0) {
      await this.fileChangeRepository.saveFileChanges(accountId, fileList);
    }

    console.log("Done");
  }
}
