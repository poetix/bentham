import { DynamoClient } from "../common/clients/DynamoClient";
import { UserEventRepository } from "./repositories/UserEventRepository"
import { WebhookEventService } from "./services/WebhookEventService"
import { WebhookEndpoint } from "./endpoints/WebhookEndpoint"

const dynamo = new DynamoClient(process.env.TABLE_PREFIX);
const userEventRepository = new UserEventRepository(dynamo)
const webhookEventService = new WebhookEventService(userEventRepository, process.env.GITHUB_WEBHOOK_SECRET)

export const webhookEndpoint = new WebhookEndpoint(webhookEventService)
