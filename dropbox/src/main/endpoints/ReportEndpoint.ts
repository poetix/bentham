/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete } from "./EndpointUtils";
import { event, callback } from "../Api";
import { ReportService } from "../services/ServiceApi"

export class ReportEndpoint {

  constructor(readonly service: ReportService) {}

  getReport(cb: callback, event: event) {
    complete(cb, this.service.getReport(event.queryStringParameters["account_id"])
    .then((report) => ({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(report)
    })));
  }

}
