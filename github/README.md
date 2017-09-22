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

## Webhook Setup

At the moment, the GiutHub Webhook has to set up manually,
pointing the `/events` (*receiveGithubEvent*) endpoint.
