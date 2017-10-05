# Login & Identity integration

An Icarus instance is bound to one Slack team.

Icarus main user identity is the user's Slack account in the team.

Users from other integrations (Dropbox, GitHub...) are mapped to the Slack user.

## User registration & Login

### Slack login

For details about Slack OAuth flow, see: https://api.slack.com/docs/oauth

This journey happens when the user is not logged in (i.e. the browser LS has no 'icarus-access-token')

1. **index.html**, Browser, User clicks Slack login button
  * Browser goes to `<team>.slack.com/oauth/authorize?scope=identity.basic&client_id=...&redirect_url=<post-login-page-url>`
  * `<post-login-page-url>` must match with a Redirect URL set in the Slack App
  * App requires `identity.basic` authorisation scope

2. User: authorises the application to access Slack
3. Browser redirected back to `<post-login-page-url>?code=<slack-authorisation-code>`
4. **post-login.html**, Browser (AJAX) GET, `<slack-login-lambda>?code=<slack-authorisation-code>`
5. **slack-login-lambda**:
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
          dropboxAccountId: <dropbox-account-id>|undefined,
          githubUsername: <github-username>|undefined,
        }
        ```  

6. **post-login.html**,
    * Stores `<icarus-access-token>` in localStorage(`icarus_access_token`)
    * Jump to **index.html**
7. **index.html** Shows integrations login buttons (Dropbox, Github...)


### Dropbox login

This journey happens when the user is logged in Slack, but not in Dropbox
(i.e. the browser LS has an 'icarus-access-token' with hasDropboxAuthorisation=false).


1. **index.html**, Browser, User clicks Dropbox login button
  * Browser goes to `<dropbox-oauth-initiate-lambda>?slackAccessToken=<slack-access-token>&returnUri=<post-dropbox-login-page-url>`

2. **dropbox-auth-initiate-lambda**:
    1. GET, `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=...&state=<slack-access-token>&redirect_uri=<return-uri-param>`
        * `redirect_uri` is the *returnUri* parameter passed to the lambda, i.e. `<post-dropbox-login-page-url>`

3. User: authorises the application to access Dropbox
4. Browser redirected back to `<post-dropbox-login-page-url>?code=<dropbox-authorisation-code>`
5. **post-dropbox-login.html**, Browser (AJAX) GET, `<dropbox-auth-complete-lambda>?code=<dropbox-authorisation-code>&slackAccessToken=<slack-access-token>`
6. **dropbox-auth-complete-lambda**
    1. Redeems `<dropbox-authorisation-code>` getting a `<dropbox-access-token>` and `<dropbox-account-id>`
    2. Stores `<dropbox-access-token>` and `<dropbox-account-id>` in the DroboxTokenRepository
    3. Obtain and stores initial cursor for the account **TODO clarify**
    4. Add Dropbox identity to the user, in the Identity Service **TODO clarify**
    5. Lambda returns (`<icarus-access-token>`)
        ```
        {
          userName: <slack-username>,
          accessToken: <slack-access-token>,
          dropboxAccountId: <dropbox-account-id>,
          githubUsername: <github-username>|undefined,
        }
        ```  

7. **post-dropbox-login.html**
    * Updates `<icarus-access-token>` in localStorage(`icarus_access_token`)
    * Jump to **dropbox-report.html**
