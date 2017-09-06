
import request = require('request')

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => cb(null,
    {
      statusCode: 200,
      body: event.queryStringParameters.challenge
    });

export const webhookNotify = (event, context, cb) => cb(null,
  processNotification(event.body));

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

const processOauthCode = (cb, code, redirectUri) => {
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
     if (res != null && (res.statusCode == 200 || res.statusCode == 201)) {
       let response = JSON.parse(body)
       console.log(`Access token: ${response.access_token}\nAccount id: ${response.account_id}`)
       cb(null, { statusCode: 200 });
     } else {
       cb(body, { statusCode: res.statusCode });
     }
   });
};
