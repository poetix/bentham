/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/

import { event, callback, challenge, uri } from "../Api";
import { pathTo, redirectTo } from "../clients/Http";
import { Notification, NotificationProcessor } from "../services/ServiceApi"

const complete = <T>(cb: callback, p: Promise<T>) =>
  p.then(res => cb(null, res)).catch(err => cb(err, null));

export class WebhookEndpoint {

  constructor(readonly service: NotificationProcessor) {}

  challenge(cb: callback, event: event) {
    cb(null,
        {
          statusCode: 200,
          body: event.queryStringParameters.challenge
        });
  }

  notify(cb: callback, event: event) {
    complete(cb, this.processAndReturn(JSON.parse(event.body)));
  }

  private async processAndReturn(notification: Notification): Promise<any> {
    await this.service.processNotification(notification);

    return {
      statusCode: 200
    };
  }
}
