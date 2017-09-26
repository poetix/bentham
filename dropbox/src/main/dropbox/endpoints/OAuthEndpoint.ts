/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "../../common/endpoints/EndpointUtils";
import { event, callback } from "../../common/Api";
import { pathTo, redirectTo } from "../../common/clients/HttpClient";
import { OAuthService } from "../services/OAuthService";

export class OAuthEndpoint {

  constructor(private readonly service: OAuthService) {}

  initiate(cb: callback, event: event) {
    cb(null, redirectTo(this.service.getOAuthUri(
      event.headers.Host,
      event.queryStringParameters.icarusAccessToken)));
  }

  complete(cb: callback, event: event) {
    return complete(cb, this.service.processCode(
      event.queryStringParameters.state,
      event.queryStringParameters.code,
      pathTo(event.headers.Host, "dropbox-oauth-complete"))
      .then((accountId) => redirectTo(
        pathTo(
          event.headers.Host,
          `dropbox-user-report?icarusAccessToken=${event.queryStringParameters.state}`))));
  }
}
