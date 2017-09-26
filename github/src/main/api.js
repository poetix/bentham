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
    const jsonBody = lambdaProxyEvent.body;
    const requestBody = JSON.parse(lambdaProxyEvent.body);
    console.log(`Webhook EventType:${webhookEventType}, deliveryId:${deliveryId}, signature:${signature}`);

    if( this.gitHubEvents.verifySignature(jsonBody, signature) ) {
      // Process event
      this.gitHubEvents.processWebhookEvent(webhookEventType, requestBody, deliveryId)
        .then(res => {
          console.log(`'${res}' successfully processed`);
          sendResponse( callback, 201, null, { 'X-GitHub-Event-Result' : res });
        })
        .catch(err => {
          console.log(err);
          sendResponse( callback, 500, { message: '`Unable process delivery'} );
        });
    } else {
      console.log('Invalid payload signature')
      sendResponse( callback, 400, { message: 'Invalid payload signature'});
    }
  }

}

module.exports = Api;
