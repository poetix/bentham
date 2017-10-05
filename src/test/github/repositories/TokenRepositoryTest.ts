import { expect, assert } from 'chai';
import 'mocha';
import { mock, instance, when, verify, capture, resetCalls, anyString, anything } from 'ts-mockito';

import { DynamoClient } from "../../../main/common/clients/DynamoClient";
import { TokenRepository } from "../../../main/github/repositories/TokenRepository";

describe('GitHub Token Repository', () => {

  describe('Save Token', () => {
    it('should put username and access token', async () => {
      const dynamoClientMock = mock(DynamoClient);
      const dynamoClient = instance(dynamoClientMock);
      const unit = new TokenRepository(dynamoClient)
      when(dynamoClientMock.put(anyString(), anything())).thenReturn(Promise.resolve())

      await unit.saveToken('my-username', 'my-access-token')

      verify(dynamoClientMock.put(anyString(), anything()) ).once()

      const [actualTableName, actualDbToken] = capture(dynamoClientMock.put).last()
      expect(actualDbToken.username).is.equal('my-username')
      expect(actualDbToken.access_token).is.equal('my-access-token')
    } )
  })

  describe('Fetch Token', () => {
    it('should return the username when retrieved from db', async () => {
      const dynamoClientMock = mock(DynamoClient);
      const dynamoClient = instance(dynamoClientMock);
      const unit = new TokenRepository(dynamoClient)
      when(dynamoClientMock.get(anyString(), anything())).thenReturn(Promise.resolve({
          username: 'my-username',
          access_token: 'my-access-token'
      }))

      const result = await unit.fetchToken('my-username')

      verify(dynamoClientMock.get(anyString(), anything())).once()

      expect(result).is.equal('my-access-token')
    })
  })

})
