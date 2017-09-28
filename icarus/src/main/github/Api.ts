export type userEventId = string; // Globally unique ID of a UserEvent
export type githubEventId = string; // Unique ID of the event on Github, unique among events of the same t
export type githubUsername = string;
export type timestamp = string;
export enum UserEventType { // User event types (i.e. events tracked by Icarus)
    commit
}




// User event (i.e. event= tracked by Icarus)
export interface UserEvent {
  id: userEventId;
  username: githubUsername;
  eventType: UserEventType;
  eventId: githubEventId;
  timestamp: timestamp;
}

// Github Webhook event types
export enum WebhookEventType {
  push,
  ping
}

export type webhookDeliveryId = string;
export type webhookPayloadSignature = string;
export type webhookPayload = any;
export type json = string;

// Webhook event (i.e. event delivered by Github webhook)
export interface WebhookEvent {
  eventType: WebhookEventType|string;
  deliveryId: webhookDeliveryId;
  payload: webhookPayload;
}



export type githubWebhookSecret = string;
