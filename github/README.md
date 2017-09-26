# GitHub WebHook integration

## Prerequisites

Node:
```
brew install node
```

NPM:
```
npm install -g serverless
npm install -g mocha
```

## Authentication

Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` env variables.

Also set `GITHUB_WEBHOOK_SECRET` for GitHub webhook OAuth.

Load the keypair `.pem` file into ssh agent.

## Serverless deployment

At the moment, only `dev` stage is configured, using `eu-west-2` (London) Region.


Remove all (ex)

## Webhook Setup

At the moment, the GiutHub Webhook has to be set up manually:

* *Payload URL*: `<service-endpoint>/events`
* *Content type*: `application/json`
* *Secret*: your `GITHUB_WEBHOOK_SECRET`
* *Which events would you like to trigger this webhook?*: Send me everything (or select individual events)

## Webhook supported events

* `push`: stores individual `commit`s (not the push itself!). Implicitly de-duplicate commits.
* Any other event is ignored at the moment

## Event store

Events are stored in DynamoDB table `github-integration-<stage>-events`


Table schema:

* `id` (Partition Key): `<event_type>-<event_id>` (e.g. `commit-db08862aa3e6c3825045c18d0c8b537664805ee0`)
* `event_type`: e.g. `commit`
* `event_id`: e.g. the commit HASH
* `timestamp`: ISO 8601 Combined date and time with TZ (e.g. `2017-09-26T10:26:14+01:00`)
* `username`: GitHub username

Global Secondary Index:

* `events_by_user(username, timestamp)`
