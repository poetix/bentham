/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "../../common/endpoints/EndpointUtils";
import { event, callback, SlackIdentity, slackAccessToken, host, lambdaStage } from "../../common/Api";
import { IdentityService } from "../../common/services/IdentityService";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";
import { dropboxAccountId } from "../Api"

export class OAuthEndpoint {

  constructor(
    private readonly oauthService: OAuthService) {}

  initiate(cb: callback, event: event) {
    const slackAccessToken = event.queryStringParameters.slackAccessToken
    const host = event.headers.Host
    const stage = event.requestContext.stage

    cb(null, redirectTo(this.oauthService.getOAuthUri(host, stage, slackAccessToken)));
  }

  complete(cb: callback, event: event) {
    const host = event.headers.Host
    const stage = event.requestContext.stage

    const oauthCompleteUri = pathToLambda(host, stage, "dropbox-oauth-complete")


    return complete(cb, this.oauthService.processCode(event.queryStringParameters.state, event.queryStringParameters.code, oauthCompleteUri)
      .then((dropboxAccountId) => redirectTo(
        pathToLambda(host, stage, `dropbox-user-report?dropbox_account_id=${dropboxAccountId}`))));
  }

}
