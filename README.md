# Icarus

Serverless project for monitoring various repositories and productivity tools

## Prerequisites

Node:

```bash
brew install node
```

NPM installs

```bash
npm install typescript ts-loader ts-node -g
npm install serverless -g
npm install aws-sdk
npm install @types/node @types/aws-sdk @types/mocha @types/chai
npm install serverless-webpack-plugin webpack serverless-webpack serverless-finch
npm install ts-loader typescript mocha chai ts-mockito
npm install request moment
```
**TODO Not sure this list is final**


## Dev environment

Expects the following environment variables:

* `DROPBOX_CLIENT_ID` and `DROPBOX_CLIENT_SECRET`: Dropbox integration credentials
* `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`: Slack integration credentials
* `GITHUB_WEBHOOK_SECRET`: GitHub webhook application secret
* `GITHB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: GitHub API integration credentials

### AWS credentials

Setup AWS `test` profile:
```bash
serverless config credentials --provider aws --key <aws-access-key-id> --secret <aws-secret-access-key> --profile custom-profile
```

### Dev stage

The `ICARUS_DEV` environment variable is prefixed to `dev` stage, unless `stage` is overwritten by command line.

Note that `ICARUS_DEV` only allows **a-zA-Z0-9** (no hyphen, no underscore)

## More documentation

* [Login and Identity integration](./docs/login_and_identity.md)
* TBD Slack application setup
* TBD Dropbox application setup
* TBD GitHub application setup
* [GitHub webhook](./docs/github_webhook.md)
