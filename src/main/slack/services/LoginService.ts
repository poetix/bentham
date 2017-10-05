import { slackAuthCode } from "../Api";
import { SlackClient } from "../clients/SlackClient";
import { IdentityService } from "../../common/services/IdentityService";
import { UserToken, IcarusAccessToken, uri } from "../../common/Api";

export class LoginService {

  constructor(
    private readonly slack: SlackClient,
    private readonly identity: IdentityService) {}

  /*
  Completes the Slack authentication process:
  - exchanges auth code for access token
  - retrieves user's details
  - gets a UserToken from the Identity Service and returns it
  */
  async login(slackCode: slackAuthCode, loginRedirectUri: uri): Promise<IcarusAccessToken> {
    // Redeem the slack authorization code to get slack token and id.
    const token = await this.slack.getToken(slackCode, loginRedirectUri);
    // Requires `identity.basic` auth scope
    const userDetails = await this.slack.getUserDetails(token);

    console.log(userDetails);
    // Obtain a user token from the identity service, and return it.
    const userToken = await this.identity.grantUserToken({
      id: userDetails.user.id,
      teamId: userDetails.team.id,
      userName: userDetails.user.name,
      accessToken: token
    });

    // TODO We still need to pass through the UserToken?
    console.log(userToken);

    return this.identity.toIcarusAccessToken(userToken);
  }

}
