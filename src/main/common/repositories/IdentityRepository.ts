import { GithubIdentity, DropboxIdentity, slackAccessToken, SlackIdentity } from "../Api";
import { DynamoClient } from "../clients/DynamoClient";

export class IdentityRepository {

  constructor(
    private readonly dynamo: DynamoClient) {}

  async saveDropboxIdentity(slackId: string, dropboxIdentity: DropboxIdentity): Promise<DropboxIdentity> {
    console.log(`Writing Dropbox identity for Slack ID: ${slackId} to DynanoDB`)
    return this.dynamo.put("dropbox_accounts", {
      slack_id: slackId,
      dropboxId: dropboxIdentity.id,
      access_token: dropboxIdentity.accessToken
    }).then(res =>  dropboxIdentity )
  }

  async saveGithubIdentity(slackId: string, githubIdentity: GithubIdentity): Promise<GithubIdentity> {
    console.log(`Writing Github identity for Slack ID: ${slackId} to DynanoDB`)
    return this.dynamo.put("github_accounts", {
      slack_id: slackId,
      githubId: githubIdentity.id,
      access_token: githubIdentity.accessToken
    }).then(res => githubIdentity)
  }

  async saveSlackIdentity(slackAccessToken: slackAccessToken, slackIdentity: SlackIdentity): Promise<SlackIdentity> {
    console.log(`Writing Slack identity for Slack Access Token: ${slackAccessToken} to DynanoDB`)
    return Promise.all([
      this.dynamo.put("access_tokens", {
        access_token: slackAccessToken,
        slack_id: slackIdentity.id,
      }),
      this.dynamo.put("slack_accounts", {
        slack_id: slackIdentity.id,
        user_name: slackIdentity.userName,
        team_id: slackIdentity.teamId,
        access_token: slackIdentity.accessToken
      })
    ]).then(results => slackIdentity)
  }

  async getSlackIdentity(slackAccessToken: slackAccessToken): Promise<SlackIdentity> {
    // TODO Should chain Promises rather than awaiting
    const slackIdLookupResult = await this.dynamo.get("access_tokens", {
      access_token: slackAccessToken
    });

    if (!slackIdLookupResult) {
      throw new Error(`Unable to retrieve Slack ID for access token ${slackAccessToken}`);
    }

    const slackIdentityResult = await this.dynamo.get("slack_accounts", {
      slack_id: slackIdLookupResult.slack_id
    });

    if (!slackIdentityResult) {
      throw new Error(`Unable to retrieve Slack account details for slack ID token ${slackIdLookupResult.slack_id}`);
    }

    return {
      id: slackIdentityResult.slack_id,
      userName: slackIdentityResult.user_name,
      teamId: slackIdentityResult.team_id,
      accessToken: slackIdentityResult.access_token
    };
  }

  async getDropboxIdentity(slackId: string): Promise<DropboxIdentity | undefined> {
    // TODO Should chain Promises rather than awaiting
    const dropboxIdLookupResult = await this.dynamo.get("dropbox_accounts", {
      slack_id: slackId
    });

    if (!dropboxIdLookupResult) {
      console.log('No Dropbox identity found')
      return undefined;
    }

    const dropboxIdentity:DropboxIdentity = {
      id: dropboxIdLookupResult.dropboxId,
      accessToken: dropboxIdLookupResult.access_token
    }

    return dropboxIdentity
  }

  async getGithubIdentity(slackId: string): Promise<GithubIdentity | undefined> {
    // TODO Should chain Promises rather than awaiting
    const githubIdLookupResult = await this.dynamo.get("github_accounts", {
      slack_id: slackId
    });

    if (!githubIdLookupResult) {
      console.log('No Github identity found')
      return undefined;
    }

    const githubIdentity:GithubIdentity = {
      id: githubIdLookupResult.githubId,
      accessToken: githubIdLookupResult.access_token
    }

    return githubIdentity
  }
}
