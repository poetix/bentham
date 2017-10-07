/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, host, uri, lambdaStage, icarusAccessToken } from "../../common/Api";
import { IdentityService } from "../../common/services/IdentityService";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";
import { dropboxAccountId, dropboxAuthorisationCode } from "../Api"

export class OAuthEndpoint {

  constructor(
    private readonly oauthService: OAuthService) {}

  initiate(cb: callback, event: event) {
    const icarusAccessToken:icarusAccessToken = event.queryStringParameters.icarusAccessToken
    const returnUri:uri = event.queryStringParameters.returnUri
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage

    cb(null, redirectTo(this.oauthService.getOAuthAuthoriseUri(host, stage, icarusAccessToken, returnUri)));
  }

  /**
    Request
      QueryString:
      - icarusAccessToken: Icarus access token
      - code: Dropbox Authorisation code
      - initReturnUri: the returnUri passed to the initiate request, for verification by Dropbox only
    Response
      Body: IcarusUserToken
  */
  complete(cb: callback, event: event) {
    const host:host = event.headers.Host
    const stage:lambdaStage = event.requestContext.stage

    const icarusAccessToken:icarusAccessToken = event.queryStringParameters.icarusAccessToken
    const dropboxAuthorisationCode:dropboxAuthorisationCode = event.queryStringParameters.code
    const initReturnUri:uri = event.queryStringParameters.initReturnUri

    return complete(cb, this.oauthService.processCode(icarusAccessToken, dropboxAuthorisationCode, initReturnUri)
      .then((icarusUserToken) => response(200, icarusUserToken))
    );
  }

}
