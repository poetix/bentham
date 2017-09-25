import { slackAuthCode } from "../Api";
import { SlackClient } from "../clients/Slack";
import { UserToken } from "./ServiceApi";
import { IdentityService } from "./Identity";

export class LoginService {

  constructor(private slack: SlackClient, private identity: IdentityService) {}

  async login(slackCode: slackAuthCode): Promise<UserToken> {
    // Redeem the slack authorization code to get slack token and id.
    const token = await this.slack.getToken(slackCode);
    const userDetails = await this.slack.getUserDetails(token);

    // Obtain a user token from the identity service, and return it.
    const userToken = await this.identity.grantUserToken({
      id: userDetails.user.id,
      teamId: userDetails.team.id,
      userName: userDetails.user.name,
      accessToken: token
    });

    return userToken;
  }

}
