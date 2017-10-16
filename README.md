# Icarus

Serverless project for monitoring various repositories and productivity tools

## Prerequisites

Node:

```bash
brew install node
```

NPM modules

```bash
npm install serverless -g
npm install
```

## Dev environment

Expects the following environment variables:

* `SLACK_TEAM_URL`: URL of Slack team
* `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`: Slack integration credentials
* `DROPBOX_CLIENT_ID` and `DROPBOX_CLIENT_SECRET`: Dropbox integration credentials
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

* [Slack integration](./docs/slack_integration.md)
* [GitHub integration](./docs/github_integration.md)
* [Dropbox integration](./docs/dropbox_integration.md)


* [Login & authorisation journeys](./docs/login_journeys.md)
* [DynamoDB tables](./docs/DynamoDB_tables.md)
