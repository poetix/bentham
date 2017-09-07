import { pathTo } from "./Http"
import { doPost, dynamoPut } from "./CallbackConversions"

export const dropboxOauthUri = (event) =>
  "https://www.dropbox.com/oauth2/authorize?response_type=code" +
  `&client_id=${process.env.DROPBOX_CLIENT_ID}` +
  `&redirect_uri=${pathTo(event, "dropbox-oauth-complete")}`

export async function processOauthCode(code, redirectUri): Promise<any> {
  let token = await requestToken(code, redirectUri);
  let dbResult = await writeUserToken(token.accountId, token.accessToken);

  return { statusCode: 200, body: "The application is now authorised" };
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

function writeUserToken(accountId: string, accessToken: string): Promise<any> {
  console.log("Writing account access token to Dynamo");

  return dynamoPut({
    TableName: 'user_tokens',
    Item: {
      account_id: accountId,
      access_token: accessToken
    }
  });
}
