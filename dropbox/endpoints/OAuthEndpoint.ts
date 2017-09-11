/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/

import { event, callback } from "../Api";
import { pathTo, redirectTo } from "../clients/Http";
import { OAuthProcessor } from "../services/ServiceApi"

const complete = <T>(cb: callback, p: Promise<T>) =>
  p.then(res => cb(null, res)).catch(err => cb(err, null));

export class OAuthEndpoint {

  constructor(readonly service: OAuthProcessor) {}

  initiate(cb: callback, event: event) {
    cb(null, redirectTo(this.service.getOAuthUri(event)));
  }

  complete(cb: callback, event: event) {
    complete(
      cb,
      this.service.processCode(
        event.queryStringParameters.code,
        pathTo(event, "dropbox-oauth-complete")));
  }
}
