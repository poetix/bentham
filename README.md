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

## Domain setup

This application uses custom DNS names for lambdas.

The base domain must be hosted by Route53.

The domain name to use for the endpoints is defined by the `ICARUS_DOMAIN` environment variable.

DNS and certificate setup requires [manual setup](./custom_domain.md) to be executed, one-off, before deploying.

## Environment

The following environment variables are expected, to deploy the project:

* `ICARUS_DOMAIN`: DNS name of the API
* `SLACK_TEAM_URL`: URL of Slack team
* `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`: Slack integration credentials
* `DROPBOX_CLIENT_ID` and `DROPBOX_CLIENT_SECRET`: Dropbox integration credentials
* `GITHUB_WEBHOOK_SECRET`: GitHub webhook application secret
* `GITHB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: GitHub API integration credentials
* `RDS_USER` and `RDS_PWD`: RDS master user and pwd (master username default: `master`; no default pwd!)
### AWS credentials

Expects `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` set in the deployment environment.

At the moment the region is hardwired to `us-east-1`, due to a limit of Amazon Certificate Manager,
used for assigning public DNS names to lambda endpoints
(see: https://github.com/amplify-education/serverless-domain-manager#user-content-known-issues)

## Dev deployment

To deploy `dev` stage backend run:

```
sls deploy -v
```

To deploy the frontend:

```
sls client deploy
```

When working more than one developer at a time is extermely useful to have a separate dev deployment per-developer.
This includes separate endpoints, separate DynamoDB tables and separate CloudFormation stacks.

Define a different `stage` per developer, named like `<developer name>dev`. 
The developer name must contains only letters (A-Za-z) and no hyphen is allowed between the name and the suffix.

**If you omit to specify the stage, `dev` is used by default.**

To avoid having to remember `--stage ...` at every `sls ...` run, set the `ICARUS_STAGE` environment variable.
It will be used as stage by default

**DO NOT USE** `deploy.sh` during development: it only deploys the `master` branch to `test` stage. 


#### DynamoDB and RDS deletion

By default, `sls remove` does not delete DynamoDB tables and RDS instances.

To force deletion, add the `--tableDeletion Delete` option when running `sls deploy` and `sls remove`


## CI/CD

Set all required env variables in Travis project settings, including AWS credentials.

Travis uses `deploy.sh` script, and only deploys `master` branch to `test` stage.


## Public URLs

* Frontend: `https://s3.amazonaws.com/<stage>-icarus-site/`
* Lambda service base URI: `https://<icarus-domain>/<stage>/`

## More documentation

* [Custom DNS domain](./docs/custom_domain.md)

* [Slack integration](./docs/slack_integration.md)
* [GitHub integration](./docs/github_integration.md)
* [Dropbox integration](./docs/dropbox_integration.md)


* [Login & authorisation journeys](./docs/login_journeys.md)
* [DynamoDB tables](./docs/DynamoDB_tables.md)


## Known Issues/Limitations

* SSL Certificate generation and import in ACM, DNS base domain setup are all manual.
* API Gateway Custom Domains are only available in `us-east-1` Region (10/2017) so we must use that Region.
    * There is some issue deploying RDS Aurora on `us-east-1a` and `-1b`. I can't find any documentation, but other people had the same issue. CF complaining about "Your subnet group doesn't have enough availability zones..." when using `us-east-1a` and `-1b`, while it works on `-1c` and `-1d`. For example, see [this answer](https://stackoverflow.com/questions/44924723/creation-rds-aurora-cluster-via-cloudformation#answer-45340611)

* No automatic integration or acceptance test :(
