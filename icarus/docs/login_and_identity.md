# Login & Identity integration

An Icarus instance is bound to one Slack team.

Icarus main user identity is the user's Slack account in the team.

Users from other integrations (Dropbox, GitHub...) are mapped to the Slack user.

## User registration & Login oricess

### Slack login

For details about Slack OAuth flow, see: https://api.slack.com/docs/oauth

1. **index.html**, Browser, User clicks Slack login button
  * GET, `<team>.slack.com/oauth/authorize?scope=identity.basic&client_id=...&redirect_url=<fe-post-login>`
  * `<fe-post-login>` must match with a Redirect URL set in the Slack App
  * App requires `identity.basic` authorisation scope

2. User: authorises the application to access Slack
3. Browser redirected back to `<fe-post-login>?code=<slack-authorisation-code>`
4. **post-login.html**, Browser : GET, `<lambda-slack-login>?code=<slack-authorisation-code>`
5. **slack-login** lambda:
    1. Redeems `<slack-authorisation-code>` getting a `<slack-access-token>`
        * GET, `https://slack.com/api/oauth.access?client_id=...&client_secret=...&code=<slack-authorisation-code>&redirect_url=<fe-post-login>`
        * (`redirect_url` is required for verification)

    2. Retrieves User Details
        * GET, `https://slack.com/api/users.identity?client_id=...&secret=...&token=<slack-access-token>`
        * Returns: `<slack-user-id>`, `<slack-username>`, `<slack-team-id>`
        * Requires `identity.basic` auth scope

    3. **IdentityService.grantUsertoken**:
      1. Save Slack Identity (`slack_accounts` table) in DynamoDB:
          * slack_id: `<slack-user-id>`, PK: overwrites the same record every time a user login again
          * user_name: `<slack-username>`
          * team_id: `<slack-team-id>`
          * access_token: `<slack-access-token>`]

      2. Get user's identities for other integrations, if any (Dropbox, GitHub... )
          * DynamoDB `dropbox_accounts`, `github_accounts` tables. PK is `slack_id`

      3. Constructs `<user-token>`
          * Includes `<slack-access-token>`, Slack Identity and all other available identities

     4. Lambda returns (`<icarus-access-token>`)
        ```
        {
          userName: <slack-username>,
          accessToken: <slack-access-token>,
          hasDropboxAuthorisation: true|false,
          hasGithubAuthorisation: true|false,
          ...
        }
        ```  

6. **post-login.html**,
    * Stores `<icarus-access-token>` in localStorage(`icarus_access_token`)
    * Jump to **index.html**
7. **index.html** Shows integrations login buttons (Dropbox, Github...)
