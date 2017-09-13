/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "./EndpointUtils";
import { event, callback } from "../Api";
import { pathTo, redirectTo } from "../clients/Http";
import { OAuthProcessor } from "../services/ServiceApi"

export class OAuthEndpoint {

  constructor(readonly service: OAuthProcessor) {}

  initiate(cb: callback, event: event) {
    cb(null, redirectTo(this.service.getOAuthUri(event.headers.Host)));
  }

  complete(cb: callback, event: event) {
    return complete(cb, this.service.processCode(
      event.queryStringParameters.code,
      pathTo(event.headers.Host, "dropbox-oauth-complete"))
      .then((accountId) => redirectTo(pathTo(event.headers.Host, `dropbox-user-report?account_id=${accountId}`))));
  }
}
