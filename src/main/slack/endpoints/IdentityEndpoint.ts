import { callback, event, icarusAccessToken } from "../../common/Api";
import { complete, response, sendResponse, xAccessTokenHeader } from "../../common/endpoints/EndpointUtils";
import { IdentityService } from "../../common/services/IdentityService"

export class IdentityEndpoint {

    constructor(private readonly service:IdentityService) {}

    /**
     * Delete account and identities for the current user
     * 
     * Expects icarus access token as 'X-AccessToken' header
     * 
     * If the acces token is present and valid, silently accepts it returning 204, regardless the user has been deleted.
     */
    forgetMe(cb: callback, event: event) {
        const icarusAccessToken:icarusAccessToken|undefined = xAccessTokenHeader(event)
        
        if( icarusAccessToken ) {
            complete(cb, this.service.forgetUser(icarusAccessToken)
                .then( res => response(204))
                .catch( err => {
                    console.error(err)
                    return response(403, 'Unauthorized' ) // Returns unauthorised on any error
                }))
        } else {
            console.log('No access token header in request')
            sendResponse(cb, response(403, 'Unauthorized' ))      
        }
    }
} 