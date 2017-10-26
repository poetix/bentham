import { UserActivityCountRepository } from "../repositories/UserActivityCountRepository"
import { UserActivity } from "../Api"
import { IdentityRepository } from "../../common/repositories/IdentityRepository"

export interface DropboxFileChangeEvent {
    dropboxUserId: string,
    timestamp: Date,
}

export interface GithubEvent {
    githubUsername: string,
    timestamp: Date,
}

export class UserActivityStatsService {
    
    constructor(
        private readonly activityCountRepository: UserActivityCountRepository,
        private readonly identityRepository: IdentityRepository
    ) {}

    async processDropboxFileChangeEvents(events: DropboxFileChangeEvent[]):Promise<void[]> {
        // Create table if not exists
        // TODO Can't make it smarter?
        return this.activityCountRepository.createTableIfNotExists()
        .then ( ok => {
            // The table was there or has been created
            console.log(`Processing ${events.length} DropboxFileChangeEvent`) // FIXME remove
            return Promise.all( events.map( event => this.toUserActivity(event) )
                .map( eventualUserActivity => {
                    eventualUserActivity
                        .then( userActivity => {
                            if ( userActivity) {
                                console.log(`Processing User Activity: ` + JSON.stringify(userActivity)) // FIXME remove
                                return this.activityCountRepository.incActivityCount(userActivity)
                            } else {
                                console.log('Not an Icarus user') // FIXME remove
                                return Promise.resolve()
                            }
                        })
                        .catch( err => {
                            console.log('An error occurred processing a User Activity: ' + err)
                            return Promise.resolve() // Swallow the error
                        })
                } )
            )
        } )
        .catch(err => Promise.reject(err))
    }


    // Maps a DropboxFileChangeEvent to a UserActivity, for known Icarus users only
    private async toUserActivity(fileChangeEvent: DropboxFileChangeEvent): Promise<UserActivity|undefined> {
        const dropboxId = fileChangeEvent.dropboxUserId
        // If the user is not mapped, returns a resolved Promise<undefined>
        return this.identityRepository.getSlackIdentityByDropboxId(dropboxId)
            .then( slackIdentity => ({
                slackId: slackIdentity.id,
                integration: 'D',
                dow: fileChangeEvent.timestamp.getUTCDay(),
                hours: fileChangeEvent.timestamp.getUTCHours()
            }))
            .catch(err => {
                console.log(`DropboxId ${dropboxId} is not an Icarus user (${err})`)
                return undefined
            })
    }

}