import { complete } from "./EndpointUtils";
import { event, callback, slackAuthCode } from "../Api";
import { pathTo, redirectTo } from "../clients/Http";
import { LoginService } from "../services/Login"

export class SlackLoginEndpoint {

  constructor(private service: LoginService) {}

  login(cb: callback, evt: event) {
    return complete(cb, this.service.login(evt.queryStringParameters.code)
      .then(userToken => ({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          userName: userToken.identities.slack.userName,
          accessToken: userToken.accessToken,
          hasDropboxAuthorisation: userToken.identities.dropbox != undefined
        }
      })));
  }

}
