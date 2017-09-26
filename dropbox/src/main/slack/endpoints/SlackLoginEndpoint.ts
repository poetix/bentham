import { complete } from "../../common/endpoints/EndpointUtils";
import { slackAuthCode } from "../Api";
import { LoginService } from "../services/LoginService";
import { callback, event } from "../../common/Api";

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
