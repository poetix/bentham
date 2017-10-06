/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, slackAccessToken, host, uri, lambdaStage } from "../../common/Api";
import { IdentityService } from "../../common/services/IdentityService";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";
import { dropboxAccountId, dropboxAuthorisationCode } from "../Api"

export class OAuthEndpoint {

  constructor(
    private readonly oauthService: OAuthService) {}

  initiate(cb: callback, event: event) {
    const slackAccessToken:slackAccessToken = event.queryStringParameters.slackAccessToken
    const returnUri:uri = event.queryStringParameters.returnUri
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage

    cb(null, redirectTo(this.oauthService.getOAuthUri(host, stage, slackAccessToken, returnUri)));
  }

  /**
    Request
      QueryString:
      - slackAccessToken: Slack access token
      - code: Dropbox Authorisation code
      - initReturnUri: the returnUri passed to the initiate request, for verification by Dropbox only
    Response
      Body: IcarusUserToken
  */
  complete(cb: callback, event: event) {
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage

    const slackAccessToken:slackAccessToken = event.queryStringParameters.slackAccessToken
    const dropboxAuthorisationCode:dropboxAuthorisationCode = event.queryStringParameters.code
    const initReturnUri:uri = event.queryStringParameters.initReturnUri

    return complete(cb, this.oauthService.processCode(slackAccessToken, dropboxAuthorisationCode, initReturnUri)
      .then((icarusUserToken) => response(200, icarusUserToken))
    );
  }

}
