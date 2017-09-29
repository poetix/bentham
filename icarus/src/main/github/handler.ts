import { webhookEndpoint } from "./App"

export const webhookReceive = (lambdaProxyEvent, context, callback) => webhookEndpoint.receive(callback, lambdaProxyEvent)
