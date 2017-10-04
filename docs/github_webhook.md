# Github Webhook

Icarus may gather events from GitHub webhooks.

## Webhook setup

At the moment, the GiutHub Webhook has to be set up manually:

* *Payload URL*: `<service-endpoint>/github-webhook`
* *Content type*: `application/json`
* *Secret*: your `GITHUB_WEBHOOK_SECRET`
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
