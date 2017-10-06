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

This journey happens when the user is logged into Icarus with Slack, but not yet with Dropbox
(i.e. the browser LS has an 'icarus-access-token' with hasDropboxAuthorisation=false).

1. **index.html**, Browser, User clicks Dropbox login button
  * Browser goes to `<dropbox-oauth-initiate-lambda>?slackAccessToken=<slack-access-token>&returnUri=<post-dropbox-login-page-url>`

2. **dropbox-oauth-initiate-lambda**:
    1. GET, `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=...&redirect_uri=<return-uri-param>&state=<slack-access-token>`
        * `redirect_uri` is the *returnUri* parameter passed to the lambda, i.e. `<dropbox-post-login-page-url>`
        * `state=<slack-access-token>` is not actually used by the current frontend-driven implementation

3. User: authorises the application to access Dropbox
4. Browser redirected back to `<dropbox-post-login-page-url>?code=<dropbox-authorisation-code>&state=<slack-access-token>`
    * `state=<slack-access-token>` is not used by the current implementation

5. **dropbox-post-login.html**,
    * Browser (AJAX) GET, `<dropbox-auth-complete-lambda>?code=<dropbox-authorisation-code>&slackAccessToken=<slack-access-token>&initReturnUri=<post-dropbox-login-page-url>`
    * `initReturnUri` must match the oauth initiate returnUri and is used for verification by Dropbox

6. **dropbox-oauth-complete-lambda**
    1. Redeems `<dropbox-authorisation-code>` getting a `<dropbox-access-token>` and `<dropbox-account-id>`
    2. Stores `<dropbox-access-token>` and `<dropbox-account-id>` in the Dropbox Token Repository
    3. Obtains and stores initial cursor for the account **TODO clarify**
    4. Adds a Dropbox identity to the user, in the Identity Service **TODO clarify**
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
    * Jump back to **index.html**

### Github login

Similarly to Dropbox, the GitHub login journey happens when the user is logged into Icarus with Slack, but not yet with GitHub.

The flow is almost identical to the Dropbox flow.

1. **index.html**, Browser, User clicks GitHub login button
  * Browser goes to `<github-oauth-initiate-lambda>?slackAccessToken=<slack-access-token>&returnUri=<github-post-login-page-url>`

2. **github-oauth-initiate-lambda**:
    1. GET, `https://github.com/login/oauth/authorize?client_id=...&redirect_uri=<return-uri-param>&state=<slack-access-token>`
        * `redirect_uri` is the *returnUri* parameter passed to the lambda, i.e. `<github-post-login-page-url>`
        * `state=<slack-access-token>` is not actually used by the current frontend-driven implementation

3. User: authorises the application to access GitHub
4. Browser redirected back to `<github-post-login-page-url>?code=<github-authorisation-code>&state=<slack-access-token>`
    * `state=<slack-access-token>` is not used by the current implementation

5. **github-post-login.html**,
    * Browser (AJAX) GET, `<github-auth-complete-lambda>?code=<github-authorisation-code>&slackAccessToken=<slack-access-token>&initReturnUri=<github-post-login-page-url>`
    * `initReturnUri` must match the oauth initiate returnUri and is used for verification by Github

6. **github-oauth-complete-lambda**
    1. Redeems `<github-authorisation-code>` getting a `<github-access-token>`
    2. Retrieves user's details from GitHub API
    3. Stores `<github-access-token>` and `<github-username>` in the GitHub Token Repository
    4. Adds a Dropbox identity to the user, in the Identity Service **TODO clarify**
    5. Lambda returns (`<icarus-access-token>`)
        ```
        {
          userName: <slack-username>,
          accessToken: <slack-access-token>,
          dropboxAccountId: <dropbox-account-id>|undefined,
          githubUsername: <github-username>,
        }
        ```  

7. **github-post-login.html**
    * Updates `<icarus-access-token>` in localStorage(`icarus_access_token`)
    * Jump back to **index.html**
