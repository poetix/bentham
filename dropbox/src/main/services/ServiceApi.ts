import { accountId, event, accessCode, uri, response } from "../Api";

export interface OAuthProcessor {
  getOAuthUri(event: event): string
  processCode(code: accessCode, redirectUri: uri): Promise<response>
}

export interface ListFolder {
  accounts: Array<string>
}

export interface Delta {
  users: Array<number>
}

export interface Notification {
  list_folder: ListFolder,
  delta: Delta
}

export interface FileUpdateRecorder {
  recordUpdates(accountId: accountId): Promise<void>
}

export interface NotificationProcessor {
  processNotification(notification: Notification): Promise<void>
}

export interface Interaction {
  user_id: string,
  timestamp: string
}

export interface UserReport {
  userName: string,
  interactions: Array<Interaction>
}

export interface ReportService {
  getReport(accountId: accountId): Promise<UserReport>
}
