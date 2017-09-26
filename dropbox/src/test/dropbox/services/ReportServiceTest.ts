import { expect } from 'chai';
import 'mocha';
import { ReportService } from "../../../main/dropbox/services/ReportService";
import { TokenRepository } from "../../../main/dropbox/repositories/TokenRepository";
import { FileChangeRepository } from "../../../main/dropbox/repositories/FileChangeRepository";
import { DropboxClient } from "../../../main/dropbox/clients/DropboxClient";
import { mock, instance, when, verify, anyString } from 'ts-mockito';

const mockedTokenRepository = mock(TokenRepository);
const tokenRepository = instance(mockedTokenRepository);
when(mockedTokenRepository.fetchToken(anyString())).thenReturn(Promise.resolve("the token"));

const mockedFileChangeRepository = mock(FileChangeRepository);
const fileChangeRepository = instance(mockedFileChangeRepository);

when(mockedFileChangeRepository.getFileChanges(anyString())).thenReturn(Promise.resolve([{
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
}]));

const mockedDropboxClient = mock(DropboxClient);
const dropboxClient = instance(mockedDropboxClient);
when(mockedDropboxClient.getCurrentAccountDetails(anyString())).thenReturn(Promise.resolve({ userName: "Super Friends" }));

const lookup = {
  "user id 1": "Arthur Putey",
  "user id 2": "Arthur Daley"
};
when(mockedDropboxClient.getUserDetails(anyString(), anyString())).thenCall((userId, token) =>
  Promise.resolve({ userName: lookup[userId] })
);

const service = new ReportService(tokenRepository, dropboxClient, fileChangeRepository);

describe("The Report Service", () => {
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
