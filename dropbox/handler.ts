
const request = require('request')
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

export const oauthComplete = (event, context, cb) => complete(
  cb,
  processOauthCode(
    event.queryStringParameters.code,
    pathTo(event, "dropbox-oauth-complete")));

const complete = <T>(cb: (err: any, res: T) => any, p: Promise<T>) =>
  p.then(res => cb(null, res)).catch(err => cb(err, null));

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

interface accountAccessToken {
  accountId: string;
  accessToken: string;
}

async function requestToken(code: string, redirectUri: string): Promise<accountAccessToken> {
  console.log(`Requesting user token for code ${code}`);
  let response = await doPost({
    url: 'https://api.dropboxapi.com/oauth2/token',
    method: 'POST',
    form: {
      code: code,
      grant_type: "authorization_code",
      client_id: process.env.DROPBOX_CLIENT_ID,
      client_secret: process.env.DROPBOX_CLIENT_SECRET,
      redirect_uri: redirectUri
    }
  });

   console.log(`Received access token ${response.access_token} for user ${response.account_id}`);
   return {
     accessToken: response.access_token,
     accountId: response.account_id
   };
 }

const doPost = (options: any): Promise<any> => {
  return new Promise<any>((respond, reject) => {
    request(options, (err, res, body) => {
      if (res != null && res.statusCode == 200) {
        respond(JSON.parse(body));
      } else {
        reject(err);
      }
    });
  });
};

async function processOauthCode(code, redirectUri): Promise<any> {
  let token = await requestToken(code, redirectUri);
  let dbResult = await writeUserToken(token.accountId, token.accessToken);

  return { statusCode: 200, body: "The application is now authorised" };
};

const writeUserToken = (accountId: string, accessToken: string): Promise<any> => {
  console.log("Writing account access token to Dynamo");
  const params = {
    TableName: 'user_tokens',
    Item: {
      account_id: accountId,
      access_token: accessToken
    }
  };

  return new Promise<any>((respond, reject) => {
    dynamo.put(params, (err, res) => {
      if (err != null) {
        console.log("Write to Dynamo failed");
        reject(err);
      } else {
        respond(res);
      }
    });
  });
};
