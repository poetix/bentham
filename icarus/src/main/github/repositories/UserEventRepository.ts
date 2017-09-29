import { DynamoClient } from "../../common/clients/DynamoClient";
import { timestamp } from "../Api";

export type userEventId = string; // Globally unique ID of a UserEvent
export type githubEventId = string; // Unique ID of the event on Github, unique among events with the same UserEventType
export type githubUsername = string;
export enum UserEventType {
    commit,
}

// User event (i.e. event= tracked by Icarus)
export interface UserEvent {
  id: userEventId;
  username: githubUsername;
  eventType: UserEventType;
  eventId: githubEventId;
  timestamp: timestamp;
}

const baseTablename  = 'github_events'

// Repository for UserEvent: Github user related events, handled by Icarus
// (these are different from events delivered by GitHub webhook)
export class UserEventRepository {
  constructor(readonly dynamo: DynamoClient) {}

  async store(event: UserEvent): Promise<void> {
    const eventType:string = UserEventType[event.eventType]
    const storedEvent = {
      id: event.id,
      event_type: <string>eventType,
      event_id: event.eventId,
      username: event.username,
      timestamp: event.timestamp,
    }

    console.log(`Storing a '${eventType}'`)
    return this.dynamo.put(baseTablename, storedEvent);
  }
}
