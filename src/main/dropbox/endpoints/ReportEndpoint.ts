/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response } from "../../common/endpoints/EndpointUtils";
import { event, callback } from "../../common/Api";
import { ReportService } from "../services/ReportService"

export class ReportEndpoint {

  constructor(readonly service: ReportService) {}

  // FIXME Retrieve the report by access token
  getReport(cb: callback, event: event) {
    const dropboxAccountId = event.queryStringParameters["dropbox_account_id"]
    console.log(`Dropbox Account Id: ${dropboxAccountId}`)

    complete(cb, this.service.getReport(dropboxAccountId)
      .then((report) => response(200, report)));
  }

}
