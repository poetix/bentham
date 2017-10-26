import { event, callback } from "../../common/Api";
import { UserActivityStatsService, GithubEvent } from "../services/UserActivityStatsService"
import { processUserEventsAndRespond } from "./EventProcessorUtils"

// Process DynamoDB github_events stream events
// Abstract the service layer from the DynamoDB Stream event format
export class GithubEventProcessor {

    constructor(private readonly userActivityService: UserActivityStatsService) {}

    process(cb: callback, event: event) {
        // console.log('Raw lambda event: ' +  JSON.stringify(event, null, 2));

        const githubEvents = this.toGithubEvents(event)
        const _userEventProcessor = (events) => this.userActivityService.processGithubEvents(events)

        processUserEventsAndRespond(githubEvents, _userEventProcessor, cb)
    }

    // Extract multiple GithubEvents from a lambda event
    private toGithubEvents(event: event): GithubEvent[] {
        return event.Records.map( record => ({
            githubUsername: record.dynamodb.NewImage.username.S, 
            timestamp: new Date( record.dynamodb.NewImage.timestamp.S )
        }))
    }   
}