# DynamoDB Tables

Table names are always prefixed with: `icarus-[<developer>]<stage>-`

### access_token

- `slack_id`: PK, Slack user ID (e.g. `U7BV5T...`)
- `access_token`: PK, Icarus access token (UUID)

#### access_tokens_by_token Index

- `access_token`: PK

Type: GlobalSecondaryIndex
Attributes: All

### slack_accounts

- `slack_id`: PK, Slack user ID
- `access_token`: Slack OAuth access token
- `team_id`: Slack Team ID (e.g. `T5G9Z...`)
- `user_name`: Slack user name

### dropbox_accounts

- `slack_id`: PK, Slack user ID
- `access_token`: Dropbox OAuth access token
- `dropboxId`: Dropbox user ID (e.g. `dbid:AABmKIqvM...`)

**TODO Rename `dropboxId` to `drobox_id`**

### github_accounts

- `slack_id`: PK, Slack user ID
- `access_token`: Github OAuth access token
- `githubId`: Github username (e.g. `nicusX`)

**TODO Rename `githubId` to `github_id` or `username`**


## dropbox_tokens

**TODO Can't this be an Index of `dropbox_accounts`?**

- `account_id`: PK, Dropbox user ID
- `access_token`: Dropbox OAuth access token


### github_tokens

**TODO Can't this be an Index of `github_accounts`?**

- `username`: PK, Github username
- `access_token`: Github OAuth access token


### github_events

- `id`: PK, event ID
- `eventType`: Event type (e.g. `commit`)
- `object_uri`: URI of the referenced object
- `object_type`: Type of the referenced object (e.g. `commit`)
- `timestamp`: Event timestamp, ISO 8691 date and time with TZ
- `username`: Github username

#### events_by_user Index

- `username`: PK
- `timestamp`: SK

Type: GlobalSecondaryIndex
Attributes: All

### drobpox_cursors

- `account_id`: PK, Dropbox user ID
- `cursor`: Dropbox cursor ID

### dropbox_file_changes

- `account_id`: PK, Dropbox user ID
- `user_id`: *Modified by* user ID
- `timestamp`: timestamp **TODO Format?**
- `type`: tag **TODO ??**
