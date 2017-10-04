# Identity integration

Icarus main user identity is the Slack account

## Login process

### Slack OAuth flow

See: https://api.slack.com/docs/oauth

1. **FE Index**, Browser, User clicks Slack login button
  - GET, `<team>.slack.com/oauth/authorize?scope=identity.basic&client_id=...&redirect_url=<fe-post-login>`
  - `<fe-post-login>` must match with a Redirect URL set in the Slack App
  - App requires `identity.basic` authorisation scope

2. User: authorises the application to access Slack
3. Browser redirected back to `<fe-post-login>?code=<slack-authorisation-code>`
4. **FE Post Login**, Browser : GET, `<lambda-slack-login>?code=<slack-authorisation-code>`

  **Slack Login Lambda**:
    1. Redeems `<slack-authorisation-code>` getting a `<slack-access-token>`
      - GET, `https://slack.com/api/oauth.access?client_id=...&client_secret=...&code=<slack-authorisation-code>&redirect_url=<fe-post-login>`
      - (`redirect_url` is required for verification)

    2. Retrieves User Details
      - GET, `https://slack.com/api/users.identity?client_id=...&secret=...&token=<slack-access-token>`
      - Returns: `<slack-user-id>`, `<slack-username>`, `<slack-team-id>`
      - Requires `identity.basic` auth scope

    3. **Identity Service**, Grant User token:
      1. Save Slack Identity (`slack_accounts` table) in DynamoDB:
        - slack_id: `<slack-user-id>`, PK: overwrites the same record every time a user login again
        - user_name: `<slack-username>`
        - team_id: `<slack-team-id>`
        - access_token: `<slack-access-token>`
      2. Get user's identities for other integrations, if any (Dropbox, GitHub... )
        - DynamoDB `dropbox_accounts`, `github_accounts` tables. PK is `slack_id`
      3. Constructs `<user-token>`
        - Includes `<slack-access-token>`, Slack Identity and all other available identities

     4. Returns (`<icarus-access-token>`)
      ```
      {
        userName: <slack-username>,
        accessToken: <slack-access-token>,
        hasDropboxAuthorisation: true|false,
        hasGithubAuthorisation: true|false,
        ...
      }
      ```  
6. **FE Post Login**, Browser stores `<icarus-access-token>` in localStorage(`icarus_access_token`)
7.  **FE Post Login**, Browser goes to **FE Index** => Shows integrations login buttons (Dropbox, Github...)
