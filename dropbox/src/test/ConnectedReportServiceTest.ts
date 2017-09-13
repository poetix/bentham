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
    saveFileChanges(accountId: string, fileList: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getFileChanges(accountId: string): Promise<any[]> {
        return [{ timestamp: "2017-09-10T15:44:23.789Z" }];
    }
}

class TestDropboxClient implements DropboxClient {
    getOAuthUri(event: any): string {
        throw new Error("Method not implemented.");
    }
    requestToken(code: string, redirectUri: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    fetchFiles(accountId: string, token: string, cursor?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getUserDetails(accountId: string, token: string): Promise<UserDetails> {
        return {
          userName: "Arthur Putey"
        };
    }
}

const tokens = new TestTokenRepository();
const fileChanges = new TestFileChangeRepository();
const dropbox = new TestDropboxClient();

const service = new ConnectedReportService(tokens, dropbox, fileChanges);

describe("Connected Report Service", () => {
  it("should combine the user's name and file change history", async () => {
    const result = await service.getReport("the account id");

    expect(result.userName).to.equal("Arthur Putey");
    expect(result.interactions).to.deep.equal(["2017-09-10T15:44:23.789Z"]);
  });
});
