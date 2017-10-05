import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, verify, resetCalls, anyString,  anything } from 'ts-mockito';

import { OAuthService } from "../../../main/github/services/OAuthService";
import { TokenRepository } from "../../../main/github/repositories/TokenRepository";
import { IdentityService } from "../../../main/common/services/IdentityService"
import { GithubClient } from "../../../main/github/clients/GithubClient";
import { GithubIdentity, UserToken } from "../../../main/common/Api"

const tokenRepositoryMock = mock(TokenRepository)
const tokenRepository = instance(tokenRepositoryMock)

const identityServiceMock = mock(IdentityService)
const identityService = instance(identityServiceMock)

const githubClientMock = mock(GithubClient)
const githubClient = instance(githubClientMock)

const unit = new OAuthService(identityService, githubClient, tokenRepository)

when(tokenRepositoryMock.saveToken(anyString(), anyString())).thenReturn(Promise.resolve())
when(identityServiceMock.addIdentity(anyString(), 'github', anything() )).thenReturn(Promise.resolve(
  {
    accessToken: '',
    identities: {
      slack: {
        id: '',
        accessToken: '',
        teamId: '',
        userName: '',
      },
      github: {
        id:'github-username',
        accessToken: 'github-access-token',
      }
    }
  }
 ))
when(githubClientMock.getUsername(anyString())).thenReturn(Promise.resolve('github-username'))
when(githubClientMock.requestAccessToken(anyString(), anyString())).thenReturn(Promise.resolve('github-access-token'))

beforeEach(() => {
  resetCalls(tokenRepositoryMock)
  resetCalls(identityServiceMock)
  resetCalls(githubClientMock)
})

describe('GitHub OAuth Service', () => {
  describe('Process Auth Code', async () => {

    it('should return the username', async () => {
      const result = await unit.processCode('icarus-access-token', 'github-access-code', 'http://return.uri')
      expect(result).is.equal('github-username')
    })

    it('should exchange Access Code for Access Token', async () => {
      const result = await unit.processCode('icarus-access-token', 'github-access-code', 'http://return.uri')
      verify(githubClientMock.requestAccessToken('github-access-code', 'http://return.uri')).once()
    })

    it('should request the username', async () => {
      const result = await unit.processCode('icarus-access-token', 'github-access-code', 'http://return.uri')
      verify(githubClientMock.getUsername('github-access-token')).once()
    })

    it('should save the token in Token Repository', async () => {
      const result = await unit.processCode('icarus-access-token', 'github-access-code', 'http://return.uri')
      verify(tokenRepositoryMock.saveToken('github-username', 'github-access-token')).once()
    })

    it('should add a new Identity to Identity Service', async () => {
      const result = await unit.processCode('icarus-access-token', 'github-access-code', 'http://return.uri')
      verify(identityServiceMock.addIdentity('icarus-access-token', 'github', anything() )).once()
    })

  })
})
