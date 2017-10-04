import { GithubIdentity, DropboxIdentity, slackAccessToken, SlackIdentity } from "../Api";
import { DynamoClient } from "../clients/DynamoClient";

export class IdentityRepository {

  constructor(
    private readonly dynamo: DynamoClient) {}

  async saveDropboxIdentity(slackId: string, dropboxIdentity: DropboxIdentity): Promise<void> {
    await this.dynamo.put("dropbox_accounts", {
      slack_id: slackId,
      dropboxId: dropboxIdentity.id,
      access_token: dropboxIdentity.accessToken
    });
  }

  async saveGithubIdentity(slackId: string, githubIdentity: GithubIdentity): Promise<void> {
    await this.dynamo.put("github_accounts", {
      slack_id: slackId,
      githubId: githubIdentity.id,
      access_token: githubIdentity.accessToken
    });
  }

  async saveSlackIdentity(slackAccessToken: slackAccessToken, slackIdentity: SlackIdentity): Promise<void> {
    await Promise.all([
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
    ]);
  }

  async getSlackIdentity(slackAccessToken: slackAccessToken): Promise<SlackIdentity> {
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
    const dropboxIdLookupResult = await this.dynamo.get("dropbox_accounts", {
      slack_id: slackId
    });

    if (!dropboxIdLookupResult) {
      return undefined;
    }

    return {
      id: dropboxIdLookupResult.dropbox_id,
      accessToken: dropboxIdLookupResult.access_token
    }
  }

  async getGithubIdentity(slackId: string): Promise<GithubIdentity | undefined> {
    const githubIdLookupResult = await this.dynamo.get("github_accounts", {
      slack_id: slackId
    });

    if (!githubIdLookupResult) {
      return undefined;
    }

    return {
      id: githubIdLookupResult.github_id,
      accessToken: githubIdLookupResult.access_token
    }
  }
}
