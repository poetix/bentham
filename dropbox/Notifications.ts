import { dynamoGet, doHttp } from "./CallbackConversions"

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

export async function processNotification(notificationBody: string): Promise<any> {
  console.log(notificationBody);
  const notification: Notification = JSON.parse(notificationBody);

  await Promise.all(notification.list_folder.accounts.map(recordFileUpdates));

  console.log("Processed notification");
  return {
    statusCode: 200
  };
};

async function recordFileUpdates(accountId: string): Promise<void> {
  const [token, cursor] = await Promise.all([fetchToken(accountId), fetchCursor(accountId)]);

  if (token == null) {
    console.log(`No token for account ${accountId}`);
    return; // bomb out early
  }

  const fileList = await fetchFiles(accountId, token, cursor);
  console.log(fileList.map(entry => entry.name));

  console.log("Done");
}

async function fetchToken(accountId: string): Promise<string> {
  const result = await dynamoGet({
    Key: {
      "account_id": accountId
    },
    TableName: "user_tokens"
  });

  return result && result.access_token || null;
}

async function fetchCursor(accountId: string): Promise<string> {
  return null; // for later
}

async function fetchFiles(accountId: string, token: string, cursor: string): Promise<any> {
  console.log(`Fetching files for account ${accountId}, using token ${token}`);

  var result
  if (cursor == null) {
    result = await listFolder(token)
  } else {
    result = await listFolderContinue(token, cursor);
  }

  var entries = result.entries;
  while (result.has_more) {
    console.log(`Fetching more files at cursor ${result.cursor}`);

    result = await listFolderContinue(token, result.cursor);
    entries = entries.concat(result.entries);
  }

  console.log("Fetched all files");

  await persistCursor(accountId, result.cursor);

  console.log(entries.size);

  return entries;
}

async function persistCursor(accountId: string, cursor: string): Promise<void> {
  console.log(`Persisting cursor ${cursor} for account ${accountId}`);
  return;
}

const listFolder = (token: string): Promise<any> =>
  doHttp({
    url: 'https://api.dropboxapi.com/2/files/list_folder',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      path: "",
      recursive: true,
      include_media_info: true,
      include_deleted: false,
      include_has_explicit_shared_members: false,
      include_mounted_folders: true
    }
  });

const listFolderContinue = (token: string, cursor: string): Promise<any> =>
  doHttp({
    url: 'https://api.dropboxapi.com/2/files/list_folder/continue',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      cursor: cursor
    }
  });
