/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, icarusAccessToken } from "../../common/Api";
import { ReportService } from "../services/ReportService"

export class ReportEndpoint {

  constructor(readonly service: ReportService) {}

  // FIXME Pass Token in header
  getReport(cb: callback, event: event) {
    const icarusAccessToken:icarusAccessToken = event.queryStringParameters.icarusAccessToken


    complete(cb, this.service.getReport(icarusAccessToken)
      .then((report) => response(200, report)));
  }

}
