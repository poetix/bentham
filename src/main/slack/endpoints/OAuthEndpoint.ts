import { complete, response } from "../../common/endpoints/EndpointUtils";
import { redirectTo } from "../../common/clients/HttpClient";
import { slackAuthCode } from "../Api";
import { OAuthService } from "../services/OAuthService";
import { callback, event, uri, host, lambdaStage } from "../../common/Api";

export class OAuthEndpoint {

  constructor(
    private readonly oAuthService: OAuthService) {}

  // Initiate OAuth flow sending the user to the Slack Authorise endpoint
  initiate(callback: callback, evt: event) {
    const returnUri:uri = evt.queryStringParameters.returnUri
    
    callback(null, redirectTo(this.oAuthService.getOAuthAuthoriseUri(returnUri)));
  }

  // Complete OAuth flow, redeeming the auth code
  complete(cb: callback, evt: event) {
    const slackAuthCode = evt.queryStringParameters.code
    const returnUri:uri = evt.queryStringParameters.returnUri

    return complete(cb, this.oAuthService.processCode(slackAuthCode, returnUri)
      .then(icarusUserToken => response(200, icarusUserToken)));
  }

}
