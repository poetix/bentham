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

Expects `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` set in the deployment environment.

At the moment the region is hardwired to `eu-west-2`

### Dev stage

The `ICARUS_DEV` environment variable is prefixed to `dev` stage, unless `stage` is overwritten by command line.

Note that `ICARUS_DEV` only allows **a-zA-Z0-9** (no hyphen, no underscore)

### DynamoDB table deletion

By default, `sls remove` does not delete DynamoDB tables.

To force deletion, add the `--tableDeletion Delete` option when running `sls deploy` and `sls remove`

### Dev deployment

- Don't forget setting up `ICARUS_DEV`.
- Deploy using `sls deploy -v` (optionally `sls deploy --tableDeletion Delete -v`)
- Remove with `sls remove -v` (`sls remove --tableDeletion Delete -v` to also drop DynamoDB tables)  

**DO NOT USE** `deploy.sh` during development: it only deploys master branch to `test` stage. 

## CI/CD

Set all required env variables in Travis project settings, including AWS credentials.


## More documentation

* [Slack integration](./docs/slack_integration.md)
* [GitHub integration](./docs/github_integration.md)
* [Dropbox integration](./docs/dropbox_integration.md)


* [Login & authorisation journeys](./docs/login_journeys.md)
* [DynamoDB tables](./docs/DynamoDB_tables.md)
