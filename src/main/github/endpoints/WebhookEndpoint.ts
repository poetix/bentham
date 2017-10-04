import { complete } from "../../common/endpoints/EndpointUtils";
import { event, callback } from "../../common/Api";
import { WebhookEventService, WebhookEvent, webhookEventType } from "../services/WebhookEventService";

export class WebhookEndpoint {
  constructor(private readonly service:WebhookEventService) {}

  receive(callback:callback, lambdaProxyEvent:event) {
    const webhookEventType = lambdaProxyEvent.headers['X-GitHub-Event']
    const signature = lambdaProxyEvent.headers['X-Hub-Signature']
    const requestJsonBody = lambdaProxyEvent.body

    console.log(`Received '${webhookEventType}' Github webhook event`)

    if( this.service.verifySignature(requestJsonBody, signature) ) {

      const webhookEvent:WebhookEvent = {
        eventType: webhookEventType,
        deliveryId: lambdaProxyEvent.headers['X-GitHub-Delivery'],
        payload: JSON.parse(requestJsonBody)
      }

      this.service.processWebhookEvent(webhookEvent)
        .then(res => sendResponse(callback, 201))
        .catch(err => sendResponse(callback, 500, { 'X-GitHub-Webhook-Error': err }))
    } else {
      sendResponse(callback, 400, { 'X-GitHub-Webhook-Error': 'Invalid payload signature'})
    }
  }
}

const sendResponse = (callback, statusCode:number, headers:any = null) => {
  callback(null, {
      statusCode: statusCode,
      headers: headers,
  });
}
