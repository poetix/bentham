import { expect } from 'chai';
import 'mocha';
import { ConnectedReportService } from "../main/services/Report";
import { TokenRepository, FileChangeRepository } from "../main/Repositories";
import { DropboxClient, UserDetails } from "../main/clients/ClientApi";

class TestTokenRepository implements TokenRepository {
    async fetchToken(accountId: string): Promise<string> {
        return "the token";
    }
    saveToken(accountId: string, accessToken: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

class TestFileChangeRepository implements FileChangeRepository {
    saveFileChanges(accountId: string, changeList: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getFileChanges(accountId: string): Promise<any[]> {
        return [{
          user_id: "user id 1",
          timestamp: "2017-09-10T15:44:23.789Z",
          tag: "file"
        },
        {
          user_id: "user id 1",
          timestamp: "2017-09-11T15:44:23.789Z",
          tag: "file"
        },
        {
          user_id: "user id 2",
          timestamp: "2017-09-12T15:44:23.789Z",
          tag: "file"
        }];
    }
}

// Maybe this would be a good time to investigate a mocking framework
class TestDropboxClient implements DropboxClient {
    async getCurrentAccountDetails(token: string): Promise<UserDetails> {
      return {
        userName: "Super Friends"
      };
    }

    constructor(private userNames: { [key:string]: string }) {}

    getLatestCursor(accountId: string, token: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getOAuthUri(event: any): string {
        throw new Error("Method not implemented.");
    }
    requestToken(code: string, redirectUri: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    fetchFiles(accountId: string, token: string, cursor?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getUserDetails(userId: string, token: string): Promise<UserDetails> {
        return {
          userName: this.userNames[userId]
        };
    }
}

const tokens = new TestTokenRepository();
const fileChanges = new TestFileChangeRepository();
const dropbox = new TestDropboxClient({
  "user id 1": "Arthur Putey",
  "user id 2": "Arthur Daley"
});

const service = new ConnectedReportService(tokens, dropbox, fileChanges);

describe("Connected Report Service", () => {
  it("should combine the user's name and file change history", async () => {
    const result = await service.getReport("the account id");

    expect(result.accountName).to.equal("Super Friends");
    expect(result.interactions).to.deep.equal({
      "user id 1": {
          userName: "Arthur Putey",
          interactions: [
            { timestamp: "2017-09-10T15:44:23.789Z" },
            { timestamp: "2017-09-11T15:44:23.789Z" }
          ]
      },
      "user id 2": {
          userName: "Arthur Daley",
          interactions: [
            { timestamp: "2017-09-12T15:44:23.789Z" }
          ]
      },
    });
  });
});
