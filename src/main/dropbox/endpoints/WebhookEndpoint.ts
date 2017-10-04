/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "../../common/endpoints/EndpointUtils";
import { event, callback, uri } from "../../common/Api";
import { challenge } from "../Api";
import { pathTo, redirectTo } from "../../common/clients/HttpClient";
import { Notification, NotificationService } from "../services/NotificationService";

export class WebhookEndpoint {

  constructor(private readonly service: NotificationService) {}

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
