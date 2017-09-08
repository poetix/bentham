import { dynamoGet, dynamoPut, dynamoBatchWrite, doHttp } from "./CallbackConversions"

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

  const fileList = (await fetchFiles(accountId, token, cursor))
    .filter(entry => entry.client_modified);
    
  if (fileList.length > 0) {
    await persistChanges(accountId, fileList);
  }

  console.log("Done");
}

const persistChanges = (accountId: string, fileList: Array<any>): Promise<void> => {
  const putRequests = fileList.map(entry => ({
    PutRequest: {
      Item: {
        "account_id": accountId,
        timestamp: entry.client_modified,
        type: entry[".tag"]
      }
    }
  }));

  console.log("Writing items to DynamoDB");
  return dynamoBatchWrite({
    RequestItems: {
      file_changes: putRequests
    }
  });
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
  const result = await dynamoGet({
    Key: {
      "account_id": accountId
    },
    TableName: "user_cursors"
  });

  return result && result.cursor || null;
}

async function fetchFiles(accountId: string, token: string, cursor: string): Promise<any> {
  console.log(`Fetching files for account ${accountId}, using token ${token}`);

  var result
  if (cursor == null) {
    result = await listFolder(token)
  } else {
    result = await listFolderContinue(token, cursor);
  }

  console.log(result)

  var entries = result.entries;
  while (result.has_more) {
    console.log(`Fetching more files at cursor ${result.cursor}`);

    result = await listFolderContinue(token, result.cursor);
    entries = entries.concat(result.entries);
  }

  console.log("Fetched all files");

  if (result.cursor != null) {
    await persistCursor(accountId, result.cursor);
  } else {
    console.log("Cursor is null");
  }

  return entries;
}

function persistCursor(accountId: string, cursor: string): Promise<void> {
  console.log(`Persisting cursor ${cursor} for account ${accountId}`);

  return dynamoPut({
    TableName: 'user_cursors',
    Item: {
      account_id: accountId,
      cursor: cursor
    }
  });
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
