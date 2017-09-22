// Wires up the application
'use strict';

const AWS = require('aws-sdk');
const DynamoDbClient = require('./clients/dynamoDb');
const GithubEvents = require('./services/githubEvents');
const Api = require('./api');

AWS.config.setPromisesDependency(require('bluebird'));

const eventDynamoDbClient = new DynamoDbClient(new AWS.DynamoDB.DocumentClient(), process.env.EVENT_TABLE );
const githubEvents = new GithubEvents(eventDynamoDbClient, process.env.GITHUB_WEBHOOK_SECRET);
const api = new Api(githubEvents);

module.exports = {
  api: api,
};
