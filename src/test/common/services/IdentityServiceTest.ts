import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, verify, resetCalls, anyString,  anything } from 'ts-mockito';

import { IdentityService } from "../../../main/common/services/IdentityService"
import { IdentityRepository } from "../../../main/common/repositories/IdentityRepository"
import { slackAccessToken, IdentitySet, SlackIdentity, DropboxIdentity, GithubIdentity, IcarusUserToken, icarusAccessToken } from "../../../main/common/Api";

const slackIdentity:SlackIdentity = {
  id: 'slack-account-id',
  accessToken: 'slack-access-token',
  teamId: 'slack-team-id',
  userName: 'slack-username'
}

const dropboxIdentity:DropboxIdentity = {
  id: 'dropbox-account-id',
  accessToken: 'dropbox-access-token'
}

const githubIdentity:GithubIdentity = {
  id: 'github-username',
  accessToken: 'github-access-token'
}

describe('Identity service, get Icarus user token', () => {

  describe('get Icarus user token ', () => {

    it('should return a token with Dropbox ID and GitHub username when all identities are available', async () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))
  
      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getDropboxIdentity(anyString())).thenReturn(Promise.resolve( dropboxIdentity ))
      when(repositoryMock.getGithubIdentity(anyString())).thenReturn(Promise.resolve( githubIdentity ))
  
      const result = await unit.getIcarusUserToken('icarus-access-token')
  
      expect(result.accessToken).to.be.ok
      expect(result.userName).is.equal(slackIdentity.userName)
      expect(result.dropboxAccountId).is.equal(dropboxIdentity.id)
      expect(result.githubUsername).is.equal(githubIdentity.id)
  
      verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
      verify(repositoryMock.getDropboxIdentity(slackIdentity.id)).once()
      verify(repositoryMock.getGithubIdentity(slackIdentity.id)).once()
  
      verify(repositoryMock.saveIcarusAccessToken(anyString(), anything())).never()
      verify(repositoryMock.saveSlackIdentity(anyString(), anything())).never()
    })
  
    it('should return a token without Dropbox ID nor Github username, when only Slack identity is available', async () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))
  
      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getDropboxIdentity(anyString())).thenReturn(Promise.resolve( undefined ))
      when(repositoryMock.getGithubIdentity(anyString())).thenReturn(Promise.resolve( undefined ))
  
      const result = await unit.getIcarusUserToken('icarus-access-token')
  
      expect(result.accessToken).to.be.ok
      expect(result.userName).is.equal(slackIdentity.userName)
      expect(result.dropboxAccountId).to.be.undefined
      expect(result.githubUsername).to.be.undefined
  
      verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
      verify(repositoryMock.getDropboxIdentity(slackIdentity.id)).once()
      verify(repositoryMock.getGithubIdentity(slackIdentity.id)).once()
  
      verify(repositoryMock.saveIcarusAccessToken(anyString(), anything())).never()
      verify(repositoryMock.saveSlackIdentity(anyString(), anything())).never()
    })
  })

  describe('get Dropbox identity', () => {
    it('should return a Dropbox identity when available ', () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))

      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getDropboxIdentity(anyString())).thenReturn(Promise.resolve( dropboxIdentity ))

      return unit.getDropboxIdentity('icarus-access-token')
      .then(result => {
          expect(result).to.be.ok
        
          verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
          verify(repositoryMock.getDropboxIdentity(slackIdentity.id)).once()
      })

    })

    it('should reject when no Dropbox identity is available', () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))

      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getDropboxIdentity(anyString())).thenReturn(Promise.resolve( undefined ))

      return unit.getDropboxIdentity('icarus-access-token')
      .catch(err => {
        expect(err).to.be.ok
        verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
        verify(repositoryMock.getDropboxIdentity(slackIdentity.id)).once()
      })
    })
  })

  describe('get Github identity', () => {
    it('should return a Github identity when available ',  () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))

      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getGithubIdentity(anyString())).thenReturn(Promise.resolve( githubIdentity ))

      return unit.getGithubIdentity('icarus-access-token')
        .then(result => {
          expect(result).to.be.ok
          
          verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
          verify(repositoryMock.getGithubIdentity(slackIdentity.id)).once()
        })
    })

    it('should reject when no Github identity is available',  () => {
      const repositoryMock = mock(IdentityRepository)
      const unit = new IdentityService(instance(repositoryMock))

      when(repositoryMock.getSlackIdentity(anyString())).thenReturn(Promise.resolve(slackIdentity))
      when(repositoryMock.getGithubIdentity(anyString())).thenReturn(Promise.resolve( undefined ))

      return unit.getGithubIdentity('icarus-access-token')
        .catch(err => {
          expect(err).to.be.ok

          verify(repositoryMock.getSlackIdentity('icarus-access-token')).once()
          verify(repositoryMock.getGithubIdentity(slackIdentity.id)).once()
        })

    })
  }) 
 
})
