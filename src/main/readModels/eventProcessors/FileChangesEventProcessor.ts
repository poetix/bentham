import { event, callback } from "../../common/Api";
import { UserActivityStatsService, DropboxFileChangeEvent } from "../services/UserActivityStatsService"

// Process DynamoDB file_changes stream events
export class FileChangesEventProcessor {

    constructor(private readonly userActivityService: UserActivityStatsService) {}

    process(cb: callback, event: event) {
        console.log(JSON.stringify(event, null, 2)); // FIXME remove logging

        const fileChangeEvents = this.toDropobxFileChangeEvents(event)
        console.log(`The event contains ${fileChangeEvents.length} DropboxFileChangeEvent`)

        this.userActivityService.processDropboxFileChangeEvents(fileChangeEvents)
            .then( success => {
                console.log('Events processed') // FIXME remove
                cb(null, "processed")
            })
            .catch(err => {
                console.log(`Error processing events: ${err}`)
                cb(err, "unable-to-process") 
            })

    }


    // Extract multiple DropboxFileChangeEvents from a lambda event
    private toDropobxFileChangeEvents(event: event): DropboxFileChangeEvent[] {
        return event.Records.map( record => ({
            dropboxAccountId: record.dynamodb.Keys.account_id.S,
            timestamp: new Date( record.dynamodb.Keys.timestamp.S )
        }))
    }

}







