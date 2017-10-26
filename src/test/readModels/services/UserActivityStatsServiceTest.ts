import { expect, assert } from 'chai';
import 'mocha';
import { mock, instance, when, verify, capture, resetCalls, anyString, anything } from 'ts-mockito';

import { UserActivityCountRepository } from "../../../main/readModels/repositories/UserActivityCountRepository"
import { IdentityRepository } from "../../../main/common/repositories/IdentityRepository"
import { UserActivityStatsService, DropboxFileChangeEvent, GithubEvent } from "../../../main/readModels/services/UserActivityStatsService"

describe('User Activity stats service', () => {

    describe('process multiple Dropbox file change events', () => {

        it('it should increment activity count for each known Icarus user', async () => {
            const identityRepositoryMock = mock(IdentityRepository)
            const indentityRepository = instance(identityRepositoryMock)
            const activityCountRepositoryMock = mock(UserActivityCountRepository)
            const activityCountRepository = instance(activityCountRepositoryMock)

            const unit = new UserActivityStatsService(activityCountRepository, indentityRepository)

            when(identityRepositoryMock.getSlackIdentityByDropboxId('dropbox-id')).thenReturn( Promise.resolve({
                id: 'slack-id',
                accessToken: 'access-token',
                teamId: 'team-id',
                userName: 'User Name'
            }) )

            when(activityCountRepositoryMock.createTableIfNotExists()).thenReturn(Promise.resolve())
            when(activityCountRepositoryMock.incActivityCount(anything())).thenReturn(Promise.resolve())
            
            const events: DropboxFileChangeEvent[] = [
                { dropboxUserId: 'dropbox-id', timestamp: new Date()},
                { dropboxUserId: 'dropbox-id', timestamp: new Date()}
            ]

            await unit.processDropboxFileChangeEvents(events)

            verify(activityCountRepositoryMock.incActivityCount(anything())).twice();
            verify(identityRepositoryMock.getSlackIdentityByDropboxId(anyString())).twice()
        } )

        it('should not increment activity count when the dropbox ID is not a known Icarus user', async () => {
            const identityRepositoryMock = mock(IdentityRepository)
            const indentityRepository = instance(identityRepositoryMock)
            const activityCountRepositoryMock = mock(UserActivityCountRepository)
            const activityCountRepository = instance(activityCountRepositoryMock)

            const unit = new UserActivityStatsService(activityCountRepository, indentityRepository)

            when(identityRepositoryMock.getSlackIdentityByDropboxId('unknown-dropbox-id')).thenReturn(Promise.reject('not-found'))

            when(activityCountRepositoryMock.createTableIfNotExists()).thenReturn(Promise.resolve())
            
            const events: DropboxFileChangeEvent[] = [
                { dropboxUserId: 'unknown-dropbox-id', timestamp: new Date()},
            ]

            await unit.processDropboxFileChangeEvents(events)
            
            verify(activityCountRepositoryMock.incActivityCount(anything())).never();
            verify(identityRepositoryMock.getSlackIdentityByDropboxId(anyString())).once()
        })
    })

    describe('process multiple Github file change events', () => {

        it('it should increment activity count for each known Icarus user', async () => {
            const identityRepositoryMock = mock(IdentityRepository)
            const indentityRepository = instance(identityRepositoryMock)
            const activityCountRepositoryMock = mock(UserActivityCountRepository)
            const activityCountRepository = instance(activityCountRepositoryMock)

            const unit = new UserActivityStatsService(activityCountRepository, indentityRepository)

            when(identityRepositoryMock.getSlackIdentityByGithubUser('github-user')).thenReturn( Promise.resolve({
                id: 'slack-id',
                accessToken: 'access-token',
                teamId: 'team-id',
                userName: 'User Name'
            }) )

            when(activityCountRepositoryMock.createTableIfNotExists()).thenReturn(Promise.resolve())
            when(activityCountRepositoryMock.incActivityCount(anything())).thenReturn(Promise.resolve())
            
            const events: GithubEvent[] = [
                { githubUsername: 'github-user', timestamp: new Date()},
                { githubUsername: 'github-user', timestamp: new Date()}
            ]

            await unit.processGithubEvents(events)

            verify(activityCountRepositoryMock.incActivityCount(anything())).twice();
            verify(identityRepositoryMock.getSlackIdentityByGithubUser(anyString())).twice()            
        })


        it('should not increment activity count when the Github Username is not a known Icarus user', async () => { 
            const identityRepositoryMock = mock(IdentityRepository)
            const indentityRepository = instance(identityRepositoryMock)
            const activityCountRepositoryMock = mock(UserActivityCountRepository)
            const activityCountRepository = instance(activityCountRepositoryMock)

            const unit = new UserActivityStatsService(activityCountRepository, indentityRepository)

            when(identityRepositoryMock.getSlackIdentityByGithubUser('unknown-github-user')).thenReturn(Promise.reject('not-found'))

            when(activityCountRepositoryMock.createTableIfNotExists()).thenReturn(Promise.resolve())
            
            const events: GithubEvent[] = [
                { githubUsername: 'unknown-github-user', timestamp: new Date()},
            ]

            await unit.processGithubEvents(events)
            
            verify(activityCountRepositoryMock.incActivityCount(anything())).never();
            verify(identityRepositoryMock.getSlackIdentityByGithubUser(anyString())).once()            
        })
    })
})