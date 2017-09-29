import * as crypto from "crypto"

import { githubWebhookSecret, json } from "../Api";
import { UserEventRepository, UserEventType, UserEvent } from "../repositories/UserEventRepository";

export type webhookDeliveryId = string;
export type webhookPayloadSignature = string;
export type webhookPayload = any;
export type webhookEventType = string

// Webhook event (i.e. event delivered by Github webhook)
export interface WebhookEvent {
  eventType: webhookEventType;
  deliveryId: webhookDeliveryId;
  payload: webhookPayload;
}



// Service for processing Github webhook events
export class WebhookEventService {
  constructor(private readonly eventRepository:UserEventRepository, private readonly secret:githubWebhookSecret){}

  // Verify webhook delivery payload signature
  verifySignature(jsonPayload:json, signature:webhookPayloadSignature,): Boolean {
    const computedSignature:string = 'sha1=' + crypto.createHmac('sha1', this.secret).update(jsonPayload).digest('hex');
    return (computedSignature == signature)
  }

  // Process a webhook event, possibli splitting into multiple user events
  async processWebhookEvent(webhookEvent:WebhookEvent): Promise<void> {
    console.log(`Processing a '${webhookEvent.eventType}' webhook event`)

    if( webhookEvent.eventType ==  'ping' ) {
      console.log("Received a 'ping'")
      return Promise.resolve();
    } else {
      const userEvents:UserEvent[] = toUserEvents(webhookEvent);
      console.log(`storing ${userEvents.length} user event(s)`)
      await Promise.all( userEvents.map( event =>  this.eventRepository.store(event) ) )
    }
  }
}


function toUserEvents(webhookEvent:WebhookEvent): UserEvent[] {
  switch(webhookEvent.eventType) {
    case 'push':
      return pushToCommits(webhookEvent)
    // ... handle more event types ...
    default:
      console.log(`Unknowns webhook event type: '${webhookEvent.eventType}'`)
      return [];
  }
}


function pushToCommits(webhookEvent:WebhookEvent): UserEvent[] {
  const commits:any[] = webhookEvent.payload.commits;
  return commits.map( commit => ({
    id: `commit-${commit.id}`,
    username: commit.committer.username,
    eventType: UserEventType.commit,
    eventId: commit.id,
    timestamp: commit.timestamp
  }))
}
