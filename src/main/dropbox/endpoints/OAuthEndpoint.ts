/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, SlackIdentity, slackAccessToken, host, lambdaStage, IcarusAccessToken } from "../../common/Api";
import { IdentityService } from "../../common/services/IdentityService";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";
import { dropboxAccountId } from "../Api"

export class OAuthEndpoint {

  constructor(
    private readonly oauthService: OAuthService,
    private readonly identityService: IdentityService) {}

  initiate(cb: callback, event: event) {
    const slackAccessToken = event.queryStringParameters.slackAccessToken
    const returnUri = event.queryStringParameters.returnUri
    const host = event.headers.Host
    const stage = event.requestContext.stage


    cb(null, redirectTo(this.oauthService.getOAuthUri(host, stage, slackAccessToken, returnUri)));
  }

  /**
    Request
      QueryString:
      - slackAccessToken: Slack access token
      - code: Dropbox Authorisation code
      - initReturnUri: the returnUri passed to the initiate request, for verification by Dropbox only
    Response
      Body: IcarusAccessToken
  */
  complete(cb: callback, event: event) {
    const host = event.headers.Host
    const stage = event.requestContext.stage

    const slackAccessToken = event.queryStringParameters.slackAccessToken
    const dropboxAuthorisationCode = event.queryStringParameters.code
    const initReturnUri = event.queryStringParameters.initReturnUri

    return complete(cb, this.oauthService.processCode(slackAccessToken, dropboxAuthorisationCode, initReturnUri)
      .then((icarusAccessToken) => response(200, icarusAccessToken))
    );
  }

}
