import { expect, assert } from 'chai';
import 'mocha';
import { mock, instance, when, verify, capture, resetCalls, anyString, anything } from 'ts-mockito';

import { DynamoClient } from "../../../main/common/clients/DynamoClient";
import { UserEventRepository, UserEvent } from "../../../main/github/repositories/UserEventRepository";

const dynamoClientMock = mock(DynamoClient);
const dynamoClient = instance(dynamoClientMock);

when(dynamoClientMock.put(anyString(), anything())).thenReturn(Promise.resolve())

beforeEach(() => {
  resetCalls(dynamoClientMock)
})


describe('The Github User Event Repository', () => {

  const unit = new UserEventRepository(dynamoClient)

  describe('Store user event', () => {
    it('should put an event to DynamoDB table on saving a user event', async () => {
      const userEvent:UserEvent = {
        id: 'user-event-id',
        username: 'github-username',
        eventType: 'commit',
        objectType: 'commit',
        objectUri: 'http://an.url',
        timestamp: '2017-09-26T14:54:38+01:00',
      }

      await unit.store(userEvent) // Should not fail


      verify(dynamoClientMock.put(anyString(), anything()) ).once()
      const [actualTableName, actualDbEvent] = capture(dynamoClientMock.put).last()


      expect(actualDbEvent.id).is.equal('user-event-id')
      expect(actualDbEvent.object_type).is.equal('commit')
      expect(actualDbEvent.object_uri).is.equal('http://an.url')
      expect(actualDbEvent.username).is.equal('github-username')
      expect(actualDbEvent.timestamp).is.equal('2017-09-26T14:54:38+01:00')

    })
  })
})
