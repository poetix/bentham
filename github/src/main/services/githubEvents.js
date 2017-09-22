// Handle GitHub webhook events
'use strict';

// Hande Github Events
//
// Note that "Github events" we save, do not necessarily coincide with the events
// notified by the Github webhook.
// For example a 'push' "Webhook event" is split into multiple 'commit' "Github Events".
//
// Currently, only accept 'push' and "ping" webhook events, ignoring anything else (pings are just logged).
// TODO Possible additions: 'issues', 'issue_comments', 'commit_comments', 'pull_request'
class GithubEvents {
  constructor(eventTableDbClient, webhookSecret) {
    this.eventDb = eventTableDbClient;
    this.secret = webhookSecret;
  }

  // Process a webhook event
  processWebhookEvent(webhookEventType, webhookEventPayload, webhookDeliveryId = null) {
    console.log(`Received Webhook delivery: ${webhookDeliveryId}`);
    switch (webhookEventType) {
      case 'push':
        console.log('Processing a "push" event');

        // Split commits
        const commits =  extractCommitsFromPush(webhookEventPayload);
        console.log(`${commits.length} Commits found`);

        // Save every commit
        for(let commit of commits) {
          saveCommit(commit, this.eventDb)
          .catch((err) => {
            // Just log errors
            console.log(`An error occurred saving commit: ${error}`);
          });
        }
        break;

      case 'ping':
        // Just log a Ping
        console.log('Received a "ping"');
        break;

      default:
        // Ignore any other event
        console.log(`Ignoring a "${webhookEventType}" event`);
    }
    return Promise.resolve(webhookEventType);

  }


  verifySignature(payloadBody, signature) {
    // TODO Verify Event Signature
    return true;
  }
}

const extractCommitsFromPush = (pushEvent) => {
  if ( pushEvent && pushEvent.commits && Array.isArray(pushEvent.commits) ){
    return pushEvent.commits
  } else {
    // Just logs, if payload is not valid
    console.log('Invalid payload: no commits in the push');
    return [];
  }
};

// Generate Commit event
const commitEvent = (commit) => {
  if ( commit
    && commit.id
    && commit.committer
    && commit.committer.username) {
      return {
        id: `commit-${commit.id}`,
        event_type: 'commit',
        event_id: commit.id,
        username: commit.committer.username,
        timestamp: commit.timestamp,
      };
    } else {
        console.log('Invalid payload: not a commits')
        return null;
    };
};

// Save event
// returns a Promise containing the global id
// (silently overwrite duplicates)
const saveCommit = (commit, eventDb) => {
  const gitHubEvent = commitEvent(commit);
  return eventDb.put(gitHubEvent)
    .then( gitHubEvent.id );
};

module.exports = GithubEvents;
