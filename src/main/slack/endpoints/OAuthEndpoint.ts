import { complete, response } from "../../common/endpoints/EndpointUtils";
import { slackAuthCode } from "../Api";
import { OAuthService } from "../services/OAuthService";
import { callback, event, uri } from "../../common/Api";

export class OAuthEndpoint {

  constructor(
    private readonly service: OAuthService,
    private readonly loginRedirectUri: uri) {}

  login(cb: callback, evt: event) {
    const slackAuthCode = evt.queryStringParameters.code

    return complete(cb, this.service.login(slackAuthCode, this.loginRedirectUri)
      .then(icarusUserToken => response(200, icarusUserToken)));
  }

}
