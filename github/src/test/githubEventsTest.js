'use strict';

const chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;
const sinon = require('sinon');

const GithubEvents = require('../main/services/githubEvents');

const testEvents = require('./testEvents');

class MockDynamoDbClient {
  put(item) {
    return Promise.resolve(item);
  }
};

class FailingMockDbClient {
  put(item) {
    return Promise.reject('something went wrong');
  }
}



describe('GithubEvents', () => {

  describe('processWebhookEvent', () => {

      describe("'push' event", () => {
        const eventType = 'push';

        it("should successfully save one commit on receiving a 'push' with a single commit", (done) => {

          const dbClient = new MockDynamoDbClient();
          const dbSpyPut = sinon.spy(dbClient, 'put'); // Spy on db put calls

          const unit = new GithubEvents(dbClient, 'secret');

          const eventPayload = testEvents.pushWithOneCommit;

          unit.processWebhookEvent(eventType, eventPayload)
            .then( (res) => {
              expect(res).is.equal(eventType);
            }).then(done,done);

          assert(dbSpyPut.calledOnce);

        });

        it("should successfully save two commits on receiving a 'push' with two commits", (done) => {

          const dbClient = new MockDynamoDbClient();
          const dbSpyPut = sinon.spy(dbClient, 'put'); // Spy on db put calls

          const unit = new GithubEvents(dbClient, 'secret');
          const eventPayload = testEvents.pushWithTwoCommits;

          unit.processWebhookEvent(eventType, eventPayload)
            .then( (res) => {
              expect(res).is.equal(eventType);
            }).then(done,done);

          assert(dbSpyPut.calledTwice);
        });

        it('should silently proceed on malformed payload (not a valid push)', (done) => {
          const dbClient = new MockDynamoDbClient();
          const dbSpyPut = sinon.spy(dbClient, 'put');

          const unit = new GithubEvents(dbClient, 'secret');
          const eventPayload = testEvents.malformedEvent;

          unit.processWebhookEvent(eventType, eventPayload)
            .then( (res) => {
              expect(res).is.equal(eventType);
            })
            .then(done,done);

          assert(dbSpyPut.notCalled);
        });

      });

      describe("unknown event type", () => {
        const eventType = 'unknown-event-type';

        it("should silently ignore an unknown event type", (done) => {
          const dbClient = new MockDynamoDbClient();
          const dbSpyPut = sinon.spy(dbClient, 'put'); // Spy on db put calls

          const unit = new GithubEvents(dbClient, 'secret');
          const eventPayload = {};

          unit.processWebhookEvent(eventType, eventPayload)
            .then( (res) => {
              expect(res).is.equal(eventType);
            }).then(done,done);

          assert(dbSpyPut.notCalled);
        });
      });

  });

  describe('verifySignature', () => {
    const secret = 'secret';
    const unit = new GithubEvents(new MockDynamoDbClient(), secret );


    const jsonPayload = testEvents.sampleJsonPayload;

    it('should accept valid signature', () => {
      const validSignature = testEvents.sampleJsonPayloadSignature;
      assert(unit.verifySignature(jsonPayload, validSignature));
    });

    it('should reject invalid signature', () => {
      assert(!unit.verifySignature(jsonPayload, 'sha1=not-valid'));
    });
  });


});
