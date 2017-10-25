import { fileChangesEventProcessor } from "./App";

// File Changes event processor
export const fileChangesEvents = (event, context, cb) => fileChangesEventProcessor.process(cb, event);