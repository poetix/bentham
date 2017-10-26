import { fileChangesEventProcessor, githubEventsProcessor } from "./App";

// Processes DynamoDB Stream events from Dropbox file changes
export const fileChangesEvents = (event, context, cb) => fileChangesEventProcessor.process(cb, event);

// Processes DynamoDB Stream events from Github events
export const githubEvents = (event, context, cb) => githubEventsProcessor.process(cb, event)