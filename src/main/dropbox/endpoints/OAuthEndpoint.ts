/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "../../common/endpoints/EndpointUtils";
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
    const host = event.headers.Host
    const stage = event.requestContext.stage

    cb(null, redirectTo(this.oauthService.getOAuthUri(host, stage, slackAccessToken)));
  }

  /**
    Request
      QueryString:
      - state: Slack access token
      - code: Dropbox Authorisation code
    Response
      Body: IcarusAccessToken
  */
  complete(cb: callback, event: event) {
    const host = event.headers.Host
    const stage = event.requestContext.stage

    const slackAccessToken = event.queryStringParameters.state
    const dropboxAuthorisationCode = event.queryStringParameters.code
    const oauthCompleteUri = pathToLambda(host, stage, "dropbox-oauth-complete")


    return complete(cb, this.oauthService.processCode(slackAccessToken, dropboxAuthorisationCode, oauthCompleteUri)
      .then((dropboxAccountId) => this.identityService.getIcarusAccessToken(slackAccessToken))
      .then((icarusAccessToken) => ({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(icarusAccessToken)
      }))
    );
  }

}
