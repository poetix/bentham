import { WebhookEventType, WebhookEvent, UserEventType, UserEvent } from "../Api";
import { githubWebhookSecret, webhookPayloadSignature, json } from "../Api";
import { UserEventRepository } from "../repositories/UserEventRepository";


import * as crypto from "crypto"


// Service for processing Github webhook events
export class WebhookEventService {
  constructor(private readonly eventRepository:UserEventRepository){}

  // Verify webhook delivery payload signature
  verifySignature(jsonPayload:json, signature:webhookPayloadSignature, secret:githubWebhookSecret): Boolean {
    const computedSignature:string = 'sha1=' + crypto.createHmac('sha1', secret).update(jsonPayload).digest('hex');
    return (computedSignature == signature)
  }

  // Process a webhook event, possibli splitting into multiple user events
  async processWebhookEvent(webhookEvent:WebhookEvent): Promise<void> {
    console.log(`Processing a '${webhookEvent.eventType}' webhook event`)

    if( webhookEvent.eventType ==  WebhookEventType.ping ) {
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
    case WebhookEventType.push:
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
