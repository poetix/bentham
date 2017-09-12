import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { NotificationProcessor, Notification } from "../main/services/ServiceApi";
import { WebhookEndpoint } from "../main/endpoints/WebhookEndpoint";

class TestProcessor implements NotificationProcessor {

    public receivedNotification: Notification

    async processNotification(notification: Notification): Promise<void> {
        this.receivedNotification = notification;
    }
}

const processor = new TestProcessor();
const endpoint = new WebhookEndpoint(processor);

const _challenge = (cb, e) => endpoint.challenge(cb, e);
const _notify = (cb, e) => endpoint.notify(cb, e);

describe("Webhook Endpoint", () => {
  it("should echo a challenge", async () => {
      const result = await toPromise(_challenge, {
        queryStringParameters: { challenge: "the challenge" }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal("the challenge");
  });

  it("should pass through a notification for processing", async () => {
    const notification: Notification = {
      list_folder: {
        accounts: []
      },
      delta: {
        users: []
      }
    };

    const result = await toPromise(_notify, {
      body: JSON.stringify(notification)
    });

    expect(result.statusCode).to.equal(200);
    expect(processor.receivedNotification).to.deep.equal(notification);
  });
});
