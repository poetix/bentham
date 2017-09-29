import { DropboxIdentity, icarusAccessToken, SlackIdentity } from "../Api";
import { DynamoClient } from "../clients/DynamoClient";

export class IdentityRepository {

  constructor(
    private readonly dynamo: DynamoClient) {}

  saveDropboxIdentity(accessToken: icarusAccessToken, dropboxIdentity: DropboxIdentity): any {
    throw new Error("Method not implemented.");
  }

  async saveSlackIdentity(accessToken: icarusAccessToken, slackIdentity: SlackIdentity): Promise<void> {
    await Promise.all([
      this.dynamo.put("access_tokens", {
        access_token: accessToken,
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

  async getSlackIdentity(accessToken: icarusAccessToken): Promise<SlackIdentity> {
    const slackIdLookupResult = await this.dynamo.get("access_tokens", {
      access_token: accessToken
    });

    if (!slackIdLookupResult) {
      throw new Error(`Unable to retrieve Slack ID for access token ${accessToken}`);
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

  getDropboxIdentity(slackId: string): Promise<DropboxIdentity | undefined> {
    throw new Error("Not implemented yet");
  }

}
