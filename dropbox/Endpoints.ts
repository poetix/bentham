/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/

import { event, callback, challenge, uri } from "./Api";
import { pathTo, redirectTo } from "./Http";
import { OAuthProcessor, Notification, NotificationProcessor } from "./services/ServiceApi"

const complete = <T>(cb: callback, p: Promise<T>) =>
  p.then(res => cb(null, res)).catch(err => cb(err, null));

export class WebhookEndpoint {

  service: NotificationProcessor;

  constructor(service: NotificationProcessor) {
    this.service = service;
  }

  challenge(cb: callback, event: event) {
    cb(null,
        {
          statusCode: 200,
          body: event.queryStringParameters.challenge
        });
  }

  notify(cb: callback, event: event) {
    console.log(event.body);
    complete(cb, this.processAndReturn(JSON.parse(event.body)));
  }

  private async processAndReturn(notification: Notification): Promise<any> {
    await this.service.processNotification(notification);

    return {
      statusCode: 200
    };
  }
}

export class OAuthEndpoint {

  service: OAuthProcessor;

  constructor(service: OAuthProcessor) {
    this.service = service;
  }

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
