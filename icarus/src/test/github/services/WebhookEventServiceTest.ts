import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, verify, resetCalls, anyString, anything } from 'ts-mockito';

import { WebhookEventService } from "../../../main/github/services/WebhookEventService";
import { UserEventRepository } from "../../../main/github/repositories/UserEventRepository";
import { WebhookEvent, WebhookEventType } from "../../../main/github/Api";

const userEventRepositoryMock = mock(UserEventRepository);
const userEventRepository = instance(userEventRepositoryMock);
import * as sampleEvents from "./sampleEvents"

when(userEventRepositoryMock.store(anything())).thenReturn(Promise.resolve());

beforeEach(() => {
  resetCalls(userEventRepositoryMock)
})

describe('Webhook Event Service', () =>{

  const unit = new WebhookEventService(userEventRepository);

  it('should save one event processing a push containing a single commit' , async () => {
    const webhookEvent:WebhookEvent = {
      eventType: WebhookEventType.push,
      deliveryId: 'delivery-id',
      payload: sampleEvents.pushWithOneCommit
    }
    await unit.processWebhookEvent(webhookEvent); // should not fail

    verify(userEventRepositoryMock.store(anything())).once();
  } )


  it('should save two events processing a push containing two commits' , async () => {
    const webhookEvent:WebhookEvent = {
      eventType: WebhookEventType.push,
      deliveryId: 'delivery-id',
      payload: sampleEvents.pushWithTwoCommits
    }
    await unit.processWebhookEvent(webhookEvent); // should not fail

    verify(userEventRepositoryMock.store(anything())).twice();
  } )

  it('should save no event processing a ping' , async () => {
    const webhookEvent:WebhookEvent = {
      eventType: WebhookEventType.ping,
      deliveryId: 'delivery-id',
      payload: sampleEvents.ping
    }
    await unit.processWebhookEvent(webhookEvent); // should not fail

    verify(userEventRepositoryMock.store(anything())).never();
  } )

  it('should save no event processing an unknown event type' , async () => {
    const webhookEvent:WebhookEvent = {
      eventType: 'unknown-type',
      deliveryId: 'delivery-id',
      payload: { foo: 'bar' }
    }
    await unit.processWebhookEvent(webhookEvent); // should not fail

    verify(userEventRepositoryMock.store(anything())).never();
  } )

})
