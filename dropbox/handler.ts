
import request = require('request')
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => cb(null,
    {
      statusCode: 200,
      body: event.queryStringParameters.challenge
    });

export const webhookNotify = (event, context, cb) => cb(null,
  processNotification(event.body)
);

// Oauth lambdas
export const oauthInitiate = (event, context, cb) => cb(null,
  redirectTo(dropboxOauthUri(event)));

export const oauthComplete = (event, context, cb) => processOauthCode(
    cb,
    event.queryStringParameters.code,
    pathTo(event, "dropbox-oauth-complete"));

const redirectTo = (uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    }
  });

const pathTo = (event, path) => `https://${event.headers.Host}/dev/${path}`;

const dropboxOauthUri = (event) =>
  "https://www.dropbox.com/oauth2/authorize?response_type=code" +
  `&client_id=${process.env.DROPBOX_CLIENT_ID}` +
  `&redirect_uri=${pathTo(event, "dropbox-oauth-complete")}`

const processNotification = (notification) => {
    console.log(notification);
    return {
      statusCode: 200
    };
};

const requestToken = (code, redirectUri, cb) => {
  console.log(`Requesting user token for code ${code}`);
  var options = {
     url: 'https://api.dropboxapi.com/oauth2/token',
     method: 'POST',
     form: {
       code: code,
       grant_type: "authorization_code",
       client_id: process.env.DROPBOX_CLIENT_ID,
       client_secret: process.env.DROPBOX_CLIENT_SECRET,
       redirect_uri: redirectUri
     }
   };

   request(options, (err, res, body) => {
     if (res != null && (res.statusCode == 200)) {
       let response = JSON.parse(body)
       console.log(`Received access token ${response.access_token} for user ${response.account_id}`);
       cb(null, {
         accessToken: response.access_token,
         accountId: response.account_id
       });
     } else {
       console.log('User token request failed');
       cb(err, null)
     }
   });
};

const processOauthCode = (cb, code, redirectUri) => {
  requestToken(code, redirectUri, (err, res) => {
    if (res == null) {
      cb(err, null);
    } else {
      writeUserToken(cb, res.accountId, res.accessToken)
    }
  });
};

const writeUserToken = (cb, accountId, accessToken) => {
  console.log("Writing account access token to Dynamo");
  const params = {
    TableName: 'user_tokens',
    Item: {
      account_id: accountId,
      access_token: accessToken
    }
  };

  dynamo.put(params, (err, res) => {
    if (err != null) {
      console.log("Write to Dynamo failed");
      cb(err, null)
    } else {
      cb(null, { statusCode: 200, body: "The application is now authorised" });
    }
  });
};
