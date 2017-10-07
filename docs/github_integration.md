# Github integration

Icarus may gather events from GitHub webhooks.

App integration is used only for retrieving user's GitHub username and link it with
the Icarus identity.

Note that webhooks delivers information about all involved users, regardless they
have an identity in Icarus.

## Github application setup

Setup an **OAuth App**

* Client ID, Client Secret: `GITHB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` set in environment
* Homepage URL: `<frontend-url>/index.html`
* Authorisation callback URL: `<frontend-url>/github-post-login.html`

## Webhook setup

Setup one or more webhooks, at repository or organisation level

* *Payload URL*: `<service-endpoint>/github-webhook`
* *Content type*: `application/json`
* *Secret*: `GITHUB_WEBHOOK_SECRET` set in your environment
* *Which events would you like to trigger this webhook?*: "Send me everything" (or "Select individual events")

## Supported webhook events

Webhook events are not stored *raw*, as received from Github.
Icarus extracts *user events* from supported *webhook events* and store them individually.

Every *user event* refers to an object. The event includes the object URI.

* `push`: stores individual commits; refers to the commit (implicitly de-duplicate commits)
* `issues`: stores the action; refers to the issue
* `commit_comment`: stores the action; refers to the commit comment
* `pull_request`: stores the action; refers to the PR
* `pull_request_review`: stores the action; refers to the review html content
* `pull_request_review_comment`: stores the action; refers to the comment
* `create`: stores the creation of a repository, branch or tag; refers to the repo or to the branch/tag tree
* `delete`: stores the creation of a branch or tag; refers to the branch/tag tree

Any other event is ignored at the moment
