import { complete } from "./EndpointUtils";
import { event, callback } from "../Api";
import { pathTo, redirectTo } from "../clients/Http";
import { SlackClient } from "../clients/ClientApi"

export class SlackLoginEndpoint {

  constructor(private slack: SlackClient) {}

  login(cb: callback, evt: event) {
    return complete(cb, this.slack.getToken(evt.queryStringParameters.code)
      .then(token => ({ statusCode: 200 })));
  }

}
