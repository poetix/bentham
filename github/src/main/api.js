// Handles http/Lambda Proxy related details
'use strict';

const sendResponse = (callback, statusCode, bodyObject = null, headers = null) => {
  callback(null, {
      statusCode: statusCode,
      body: (bodyObject) ? JSON.stringify( bodyObject ) : null,
      headers: headers,
  });
}


class Api {
  constructor(gitHubEventService) {
    this.gitHubEvents = gitHubEventService;
  }

  receiveWebhookEvent(lambdaProxyEvent, callback) {
    const webhookEventType = lambdaProxyEvent.headers['X-GitHub-Event'];
    const signature = lambdaProxyEvent.headers['X-Hub-Signature'];
    const deliveryId = lambdaProxyEvent.headers['X-GitHub-Delivery'];
    const requestBody = JSON.parse(lambdaProxyEvent.body);
    console.log(`Received:${webhookEventType}, deliveryId:${deliveryId}, signature:${signature}`);

    if( this.gitHubEvents.verifySignature(requestBody, signature) ) {
      // Process event
      this.gitHubEvents.processWebhookEvent(webhookEventType, requestBody, deliveryId)
        .then(res => {
          console.log(`${res} received`);
          sendResponse( callback, 201, null, { 'X-GitHub-Event-Result' : res });
        })
        .catch(err => {
          console.log(err);
          sendResponse( callback, 500, { message: `Unable process event for delivery ${deliveryId}`} );
        });
    } else {
      console.log('Invalid payload signature')
      sendResponse( callback, 400, { message: `Invalid payload signature for delivery ${deliveryId}`});
    }
  }

}

module.exports = Api;
