import { GithubIdentity, DropboxIdentity, slackAccessToken, SlackIdentity, icarusAccessToken } from "../Api";
import { DynamoClient } from "../clients/DynamoClient";

const dropboxAccountsTable = 'dropbox_accounts'
const githubAccountsTable = 'github_accounts'
const accessTokensTable = 'access_tokens'
const slackAccountsTable = 'slack_accounts'

export class IdentityRepository {

  constructor(
    private readonly dynamo: DynamoClient) {}

  async saveDropboxIdentity(slackId: string, dropboxIdentity: DropboxIdentity): Promise<DropboxIdentity> {
    console.log(`Writing Dropbox identity for Slack ID: ${slackId} to DynanoDB`)
    return this.dynamo.put(dropboxAccountsTable, {
      slack_id: slackId,
      dropboxId: dropboxIdentity.id,
      access_token: dropboxIdentity.accessToken
    }).then(res =>  dropboxIdentity )
  }

  async saveGithubIdentity(slackId: string, githubIdentity: GithubIdentity): Promise<GithubIdentity> {
    console.log(`Writing Github identity for Slack ID: ${slackId} to DynanoDB`)
    return this.dynamo.put(githubAccountsTable, {
      slack_id: slackId,
      githubId: githubIdentity.id,
      access_token: githubIdentity.accessToken
    }).then(res => githubIdentity)
  }

  async saveIcarusAccessToken(icarusAccessToken: icarusAccessToken, slackIdentity: SlackIdentity): Promise<icarusAccessToken> {
    console.log(`Writing Icarus Access Token ${icarusAccessToken} related to SlackID: ${slackIdentity.id}`)
    return this.dynamo.put(accessTokensTable, {
      access_token: icarusAccessToken,
      slack_id: slackIdentity.id,
    }).then(res => icarusAccessToken)
  }

  async saveSlackIdentity(icarusAccessToken: icarusAccessToken, slackIdentity: SlackIdentity): Promise<SlackIdentity> {
    console.log(`Writing Slack identity for SlackID: ${slackIdentity.id}`)
    return this.dynamo.put(slackAccountsTable, {
      slack_id: slackIdentity.id,
      user_name: slackIdentity.userName,
      team_id: slackIdentity.teamId,
      access_token: slackIdentity.accessToken
    })
    .then(res => slackIdentity)
  }

  async getSlackIdentity(icarusAccessToken: icarusAccessToken): Promise<SlackIdentity> {
    console.log(`Retreiving Slack identity by Icarus access token: ${icarusAccessToken}`)
    return this.getSlackIdByAccessToken(icarusAccessToken)
      .then( slackId => this.getSlackIdentityBySlackId(slackId) )
  }

  private async getSlackIdByAccessToken(icarusAccessToken: icarusAccessToken): Promise<string> {
    return this.dynamo.query(accessTokensTable, {
      IndexName: 'access_tokens_by_token',
      KeyConditionExpression: 'access_token = :token',
      ExpressionAttributeValues: {
        ':token': icarusAccessToken, 
      },
      ProjectionExpression: 'slack_id',
      Limit: "1",
    })
    .then(results => {
      if ( results && results.length )
        return results[0].slack_id
      else
        throw Error('Cannot find any Slack ID for Icarus access token: ' + icarusAccessToken)
    })
  }

  private async getSlackIdentityBySlackId(slackId: string): Promise<SlackIdentity> {
    return this.dynamo.get(slackAccountsTable, { slack_id: slackId })
      .then( result => {
        if(result)
          return {
            id: result.slack_id,
            userName: result.user_name,
            teamId: result.team_id,
            accessToken: result.access_token
          }
        else
          throw Error('Cannot find any Slack identity for Slack ID: ' + slackId)
      })
  }


  // Lookups Slack ID by Dropbox ID; reject if not found
  private async getSlackIdByDropboxId(dropboxId: string): Promise<string> {
    // console.log(`Looking up SlackID by Dropbox ID: ${dropboxId}`)
    return this.dynamo.query(dropboxAccountsTable, {
      IndexName: 'slackid_by_dropboxid',
      KeyConditionExpression: 'dropboxId = :dropboxId',
      ExpressionAttributeValues: {
        ':dropboxId': dropboxId, 
      },
      ProjectionExpression: 'slack_id',
      Limit: "1",
    })
    .then(results => {
      // console.log('DynamoDB query result: %j', results)
      if ( results && results.length )
        return results[0].slack_id
      else
        throw Error('Cannot find any Slack ID for Dropbox ID: ' + dropboxId)
    })    
  }

  async getSlackIdentityByDropboxId(dropboxId: string): Promise<SlackIdentity> {
    return this.getSlackIdByDropboxId(dropboxId)
      .then( slackId => this.getSlackIdentityBySlackId(slackId))
  }

  // Lookup Slack ID by Github Username; reject if not found
  private async getSlackIdByGithubUsername(githubUser: string) {
    return this.dynamo.query(githubAccountsTable, {
      IndexName: 'slackid_by_githubuser',
      KeyConditionExpression: 'githubId = :githubUser',
      ExpressionAttributeValues: {
        ':githubUser': githubUser, 
      },
      ProjectionExpression: 'slack_id',
      Limit: "1",
    })
    .then(results => {
      if ( results && results.length )
        return results[0].slack_id
      else
        throw Error('Cannot find any Slack ID for Github user: ' + githubUser)
    })      
  }

  async getSlackIdentityByGithubUser(githubUser: string): Promise<SlackIdentity> {
    return this.getSlackIdByGithubUsername(githubUser)
    .then( slackId => this.getSlackIdentityBySlackId(slackId))
  }

  async getDropboxIdentity(slackId: string): Promise<DropboxIdentity | undefined> {
    console.log(`Retrieving Dropbox identity by Slack ID: ${slackId}`)
    
    return this.dynamo.get(dropboxAccountsTable, { slack_id: slackId })
      .then( dropboxIdLookupResult => {
        if( dropboxIdLookupResult ) {
          return {
            id: dropboxIdLookupResult.dropboxId,
            accessToken: dropboxIdLookupResult.access_token
          }
        } else { 
          console.log('No Dropbox identity found')
          return undefined
        }
      })
  }

  async getGithubIdentity(slackId: string): Promise<GithubIdentity | undefined> {
    console.log(`Retrieving Github identity by Slack ID: ${slackId}`)
    
    return this.dynamo.get(githubAccountsTable, { slack_id: slackId })
      .then( githubIdLookupResult => {
        if( githubIdLookupResult ) {
          return {
            id: githubIdLookupResult.githubId,
            accessToken: githubIdLookupResult.access_token
          }
        } else {
          console.log('No Github identity found')
          return undefined
        }
      })
  }
}
