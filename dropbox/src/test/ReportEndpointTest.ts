import { toPromise } from './Utils';
import { expect } from 'chai';
import 'mocha';
import { ReportService } from "../main/services/Report";
import { ReportEndpoint } from "../main/endpoints/ReportEndpoint";
import { UserReport } from "../main/services/ServiceApi";
import { mock, instance, when, anyString, verify } from 'ts-mockito';

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

const mockedReportService = mock(ReportService);
const reportService = instance(mockedReportService);
when(mockedReportService.getReport(anyString())).thenReturn(Promise.resolve(report));

const endpoint = new ReportEndpoint(reportService);

const _getReport = (cb, e) => endpoint.getReport(cb, e);

describe("Report Endpoint", () => {
  it("should obtain a report from the report service", async () => {
      const result = await toPromise(_getReport, {
        queryStringParameters: {
          "account_id": "the account id"
        }
      });

      verify(mockedReportService.getReport("the account id")).once();

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal(JSON.stringify(report));
  });

});
