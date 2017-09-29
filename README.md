# bentham

Serverless project for monitoring various repositories and productivity tools

## Prerequisites

Node:

```bash
brew install node
```

NPM installs

```bash
npm install typescript -g
npm install ts-loader -g
npm install serverless -g
npm install serverless-webpack -g
npm install ts-node -g
npm install mocha chai -g
npm install @types/node @types/aws-sdk @types/mocha @types/chai
npm install aws-sdk
npm install serverless-webpack-plugin webpack
```
**TODO Not sure this list is final**


## Environment

Expects the following environment variables:

* `DROPBOX_CLIENT_ID` and `DROPBOX_CLIENT_SECRET`: Dropbox integration credentials
* `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`: Slack integration credentials
* `GITHUB_WEBHOOK_SECRET`: GitHub webhook SLACK_CLIENT_SECRET

### AWS credentials

Setup AWS `test` profile:
```
serverless config credentials --provider aws --key <aws-access-key-id> --secret <aws-secret-access-key> --profile custom-profile
```

### Dev stage

The `ICARUS_DEV` environment variable is prefixed to `dev` stage, unless `stage` is overwritten by command line.
Note that `ICARUS_DEV` only allows **a-zA-Z0-9** (no hyphen, no underscore)

## Github webhook setup

At the moment, the GiutHub Webhook has to be set up manually:

* *Payload URL*: `<service-endpoint>/github-webhook`
* *Content type*: `application/json`
* *Secret*: your `GITHUB_WEBHOOK_SECRET`
* *Which events would you like to trigger this webhook?*: "Send me everything" (or "Select individual events")

### Supported webhook events

Webhook events are not stored *raw*, as received from Github.
The integration extracts *user events* from supported *Github webhook events* and store them individually.

Unsupported events are silently ignored.

* `push`: stores individual `commit`s. Implicitly de-duplicate commits.
* `issues`: store the action (no de-duplication required)
* `commit_comment`: store the action (no de-duplication required)
* Any other event is ignored at the moment
