import { complete } from "../../common/endpoints/EndpointUtils";
import { slackAuthCode } from "../Api";
import { LoginService } from "../services/LoginService";
import { callback, event, uri } from "../../common/Api";

export class SlackLoginEndpoint {

  constructor(
    private readonly service: LoginService,
    private readonly loginRedirectUri: uri) {}

  login(cb: callback, evt: event) {
    return complete(cb, this.service.login(evt.queryStringParameters.code, this.loginRedirectUri)
      .then(icarusAccessToken => ({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(icarusAccessToken)
      })));
  }

}
