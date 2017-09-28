import { DynamoClient } from "../../common/clients/DynamoClient";
import { UserEvent, UserEventType } from "../Api";

// Repository for UserEvent: Github user related events, handled by Icarus
// (these are different from events delivered by GitHub webhook)
export class UserEventRepository {
  constructor(readonly dynamo: DynamoClient, readonly tablename: string) {}

  async store(event: UserEvent): Promise<void> {
    const eventType:string = UserEventType[event.eventType]
    const storedEvent = {
      id: event.id,
      event_type: eventType,
      event_id: event.eventId,
      username: event.username,
    }

    console.log(`Storing a '${eventType}'`)
    return this.dynamo.put(this.tablename, storedEvent);
  }
}
