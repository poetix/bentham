import { event, callback } from "../../common/Api";
import { UserActivityStatsService, DropboxFileChangeEvent } from "../services/UserActivityStatsService"
import { processUserEventsAndRespond } from "./EventProcessorUtils"

// Process DynamoDB file_changes stream events
export class FileChangesEventProcessor {

    constructor(private readonly userActivityService: UserActivityStatsService) {}

    process(cb: callback, event: event) {
        // console.log('Raw lambda event: ' +  JSON.stringify(event, null, 2));

        const fileChangeEvents = this.toDropobxFileChangeEvents(event)
        const _userEventProcessor = (events) => this.userActivityService.processDropboxFileChangeEvents(events)
        processUserEventsAndRespond(fileChangeEvents, _userEventProcessor, cb)
    }


    // Extract multiple DropboxFileChangeEvents from a lambda event
    // It gets the dropbox ID of the user who changed the file, not the tracked account!
    // They may be different for shared directories
    private toDropobxFileChangeEvents(event: event): DropboxFileChangeEvent[] {
        return event.Records.map( record => ({
            dropboxUserId: record.dynamodb.NewImage.user_id.S, 
            timestamp: new Date( record.dynamodb.Keys.timestamp.S )
        }))
    }
}
