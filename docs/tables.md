# Persistent tables



## DynamoDB Tables

DynamoDB table names are always prefixed with: `icarus-[<developer>]<stage>-`


### `accounts`table

- slack_id: PK, Icarus account ID == Slack ID
- access_token
- { other user info }

GSI:
- PK access_token -> KEYS_ONLY (slack_id)

### `integrations` table

- slack_id: PK
- integration: SK (S|D|G...)
- account_id: ID of the account in the integration (e.g. SlackID, DropboxID, GithubUsername)
- access_token: integration access token
- { other info: team_id, userName, }

GSI:
- account_id: PK, integration: SK -> KEYS_ONLY (slack_id)









### `access_tokens` table

- `slack_id`: PK, Slack user ID (e.g. `U7BV5T...`)
- `access_token`: PK, Icarus access token (UUID)

#### `access_tokens_by_token` index

- `access_token`: PK

Type: GlobalSecondaryIndex
Attributes: All

### `slack_accounts` table

- `slack_id`: PK, Slack user ID
- `access_token`: Slack OAuth access token
- `team_id`: Slack Team ID (e.g. `T5G9Z...`)
- `user_name`: Slack user name

### `dropbox_accounts` table

- `slack_id`: PK, Slack user ID
- `access_token`: Dropbox OAuth access token
- `dropboxId`: Dropbox user ID (e.g. `dbid:AABmKIqvM...`)

**TODO Rename `dropboxId` to `drobox_id`**

#### `slackid_by_dropboxid` index

- `dropboxId`: PK
- `slack_id`

### `github_accounts` table

- `slack_id`: PK, Slack user ID
- `access_token`: Github OAuth access token
- `githubId`: Github username (e.g. `nicusX`)

**TODO Rename `githubId` to `github_id` or `username`**

#### `slackid_by_githubuser` index

- `githubId` PK
- `slack_id`

## `dropbox_tokens` table

**TODO Can't this be an Index of `dropbox_accounts`?**

- `account_id`: PK, Dropbox user ID
- `access_token`: Dropbox OAuth access token


### `github_tokens` table

**TODO Can't this be an Index of `github_accounts`?**

- `username`: PK, Github username
- `access_token`: Github OAuth access token


### `github_events` table

- `id`: PK, event ID
- `eventType`: Event type (e.g. `commit`)
- `object_uri`: URI of the referenced object
- `object_type`: Type of the referenced object (e.g. `commit`)
- `timestamp`: Event timestamp, ISO 8691 date and time with TZ
- `username`: Github username

#### `events_by_user` Index

- `username`: PK
- `timestamp`: SK

Type: GlobalSecondaryIndex
Attributes: All

### `drobpox_cursors` table

- `account_id`: PK, Dropbox user ID
- `cursor`: Dropbox cursor ID

### `dropbox_file_changes` table

- `account_id`: PK, Dropbox user ID
- `user_id`: *Modified by* user ID
- `timestamp`: timestamp **TODO Format?**
- `type`: tag **TODO ??**

## RDS Tables

#### `user_event_counts` table

```
    slack_id VARCHAR(64) NOT NULL,
    integration CHAR(1) NOT NULL,
    dow TINYINT NOT NULL,
    hours TINYINT NOT NULL,
    event_count INTEGER NOT NULL  DEFAULT 0,
    PRIMARY KEY (slack_id, integration, dow, hours),
    INDEX (slack_id),
    INDEX (slack_id, dow),
    INDEX (slack_id, hours),
    INDEX (slack_id, dow, hours)
```