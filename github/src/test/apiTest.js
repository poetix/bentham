'use strict';

const chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;
const toPromise = require('./testUtils').toPromise;

const testEvents = require('./testEvents');

const Api = require('../main/api');

class MockGithubEventsService {
  constructor(signatureOk) {
    this.signatureOk = signatureOk;
  }
  processWebhookEvent(webhookEventType, webhookEventPayload, webhookDeliveryId = null) {
      return Promise.resolve(webhookEventType);
  };
  verifySignature(payloadBody, signature) {
    return this.signatureOk;
  }
};

const lambdaProxyEvent = (eventType, eventPayload, deliveryId, signature) => ({
  httpMethod: 'POST',
  headers : {
    Host: 'http://my.host',
    "Content-Type": 'application/json',
    "X-GitHub-Event": eventType,
    "X-Hub-Signature": signature,
    "X-GitHub-Delivery": deliveryId,
  },
  body: JSON.stringify( eventPayload ),
  requestContext:  {
      path: '/events',
  },
});


describe('api', () => {

  describe('receiveWebhookEvent', () =>{


    it('should ingest a valid signed event, returning 201 and the event type header', (done) => {
      const unit = new Api(new MockGithubEventsService(true));

      const webhookEvent = testEvents.pushWithOneCommit;
      const webhookEventType = 'some-event';
      const signature = 'a-signature';
      const proxyEvent = lambdaProxyEvent(webhookEventType, webhookEvent, 'my-delivery-id', signature);

      const _handler = (evt, cb) => unit.receiveWebhookEvent(evt, cb);

      toPromise( _handler , proxyEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.not.be.ok;
          expect(res.headers['X-GitHub-Event-Result']).is.equal(webhookEventType);
        }).then(done,done);
    });

    it('should return 400 on invalid signature', (done) =>{
      const unit = new Api(new MockGithubEventsService(false));

      const webhookEvent = testEvents.pushWithOneCommit;
      const webhookEventType = 'some-event';
      const signature = 'a-signature';
      const proxyEvent = lambdaProxyEvent(webhookEventType, webhookEvent, 'my-delivery-id', signature);

      const _handler = (evt, cb) => unit.receiveWebhookEvent(evt, cb);

      toPromise( _handler , proxyEvent )
        .then( (res) => {
          expect(res.statusCode).to.equal(400);
        }).then(done,done);
    });

  });



});
