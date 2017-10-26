/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, response, xAccessTokenHeader } from "../../common/endpoints/EndpointUtils";
import { event, callback, icarusAccessToken } from "../../common/Api";
import { ReportService } from "../services/ReportService"

export class ReportEndpoint {

  constructor(private readonly service: ReportService) {}

  /** 
    Retrieve user Dropbox report
    Expects icarus access token as 'X-AccessToken' header
  */
  getReport(cb: callback, event: event) {
    const icarusAccessToken:icarusAccessToken|undefined = xAccessTokenHeader(event)
    
    if( icarusAccessToken ) {
      complete(cb, this.service.getReport(icarusAccessToken)
      .then((report) => response(200, report)));
    } else {
      cb( response(403, 'Unauthorized' ), null)      
    }
  }

}
