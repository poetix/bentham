# Slack integration

Slack user identity represent user's Icarus identity.

## Setup Slack app

App credentials:
* Client ID, Client Secret: `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` set in your environment
* Verification token: not used at the moment

Permissions:
* OAuth Access Token: not used
* Redirect URLs: `<frontend-url>/`
* Scopes: only requires `identity.basic` permission scope
