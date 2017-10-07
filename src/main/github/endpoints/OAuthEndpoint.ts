import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, icarusAccessToken, uri, host, lambdaStage } from "../../common/Api";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";
import { githubAuthorisationCode } from "../Api"

/*
  Implements GitHub OAuth Web Application Flow
  https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/
  Stores the information to map the user Icarus identity to
*/
export class OAuthEndpoint {
  constructor(private readonly oauthService: OAuthService) {}

  // Initiate OAuth flow sending the user to the GithHub Authorise endpoint
  initiate(callback: callback, event: event) {
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage
    const icarusAccessToken:icarusAccessToken = event.queryStringParameters.icarusAccessToken
    const returnUri:uri = event.queryStringParameters.returnUri

    callback(null, redirectTo(this.oauthService.getOAuthAuthoriseUri(host, stage, icarusAccessToken, returnUri)));
  }

  complete(cb: callback, event: event) {
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage

    const icarusAccessToken:icarusAccessToken = event.queryStringParameters.icarusAccessToken
    const githubAuthorisationCode:githubAuthorisationCode = event.queryStringParameters.code
    const initReturnUri:uri = event.queryStringParameters.initReturnUri

    return complete(cb, this.oauthService.processCode(icarusAccessToken, githubAuthorisationCode, initReturnUri)
      .then((icarusUserToken) => response(200, icarusUserToken))
    );
  }
}
