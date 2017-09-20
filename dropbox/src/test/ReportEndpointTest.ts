import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { ReportService, UserReport } from "../main/services/ServiceApi";
import { ReportEndpoint } from "../main/endpoints/ReportEndpoint";

const report: UserReport = {
  accountName: "My Awesome Team",
  interactions: {
    "user 1": {
      userName: "My Awesome Colleague 1",
      interactions: ["2017-09-10T13:36:03.123Z"]
    },
    "user 2": {
      userName: "My Awesome Colleague 2",
      interactions: ["2017-09-10T13:37:02.456Z"]
    }
  }
};

class TestService implements ReportService {

  public receivedAccountId: string;

  async getReport(accountId: string): Promise<UserReport> {
    this.receivedAccountId = accountId;
    return report;
  }

}

const service = new TestService();
const endpoint = new ReportEndpoint(service);

const _getReport = (cb, e) => endpoint.getReport(cb, e);

describe("Report Endpoint", () => {
  it("should obtain a report from the report service", async () => {
      const result = await toPromise(_getReport, {
        queryStringParameters: {
          "account_id": "the account id"
        }
      });

      expect(service.receivedAccountId).to.equal("the account id");

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal(JSON.stringify(report));
  });

});
