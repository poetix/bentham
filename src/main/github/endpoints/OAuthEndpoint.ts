import { complete } from "../../common/endpoints/EndpointUtils";
import { event, callback } from "../../common/Api";
import { pathToLambda, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";

/*
  Implements GitHub OAuth Web Application Flow
  https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/
  Stores the information to map the user Icarus identity to
*/
export class OAuthEndpoint {
  constructor(private readonly service: OAuthService) {}

  // Initiate OAuth flow sending the user to the GithHub Authorise endpoint
  initiate(callback: callback, event: event) {
    const host = event.headers.Host
    const stage = event.requestContext.stage

    callback(null, redirectTo(this.service.getOAuthUri(host, stage, event.queryStringParameters.slackAccessToken)));
  }

  complete(cb: callback, event: event) {
    const host = event.headers.Host
    const stage = event.requestContext.stage

    return complete(cb, this.service.processCode(
      event.queryStringParameters.state,
      event.queryStringParameters.code,
      pathToLambda(host, stage, "github-oauth-complete"))
      .then( (username) => ({
        statusCode: 200,

        body:`GitHub username: ${username}`
      })))
      // TODO Redirect to the GitHub report page, when available
      // .then((username) => redirectTo(
      //   pathTo(
      //     event.headers.Host,
      //     `github-user-report?githubUsername=${event.queryStringParameters.state}`))))
  }
}
