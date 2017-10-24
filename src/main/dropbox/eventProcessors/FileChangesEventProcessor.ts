import { event, callback } from "../../common/Api";

// Process DynamoDB file_changes stream events
export class FileChangesEventProcessor {

    process(cb: callback, event: event) {
        console.log(JSON.stringify(event, null, 2));
        event.Records.forEach(function(record) {
            console.log(record.eventID);
            console.log(record.eventName);
            console.log('DynamoDB Record: %j', record.dynamodb);
        });
        cb(null, "received");
    }
}
