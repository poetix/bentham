import { slackAuthCode } from "../Api";
import { SlackClient } from "../clients/SlackClient";
import { IdentityService } from "../../common/services/IdentityService";
import { UserToken } from "../../common/Api";

export class LoginService {

  constructor(private slack: SlackClient, private identity: IdentityService) {}

  async login(slackCode: slackAuthCode): Promise<UserToken> {
    // Redeem the slack authorization code to get slack token and id.
    const token = await this.slack.getToken(slackCode);
    const userDetails = await this.slack.getUserDetails(token);

    console.log(userDetails);
    // Obtain a user token from the identity service, and return it.
    const userToken = await this.identity.grantUserToken({
      id: userDetails.user.id,
      teamId: userDetails.team.id,
      userName: userDetails.user.name,
      accessToken: token
    });

    console.log(userToken);

    return userToken;
  }

}
