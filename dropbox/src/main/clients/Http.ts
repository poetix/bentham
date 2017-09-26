const request = require('request');

import { host, uri } from "../Api";

export function pathTo(host: host, path: string): uri {
  return `https://${host}/dev/${path}`;
}

export function redirectTo(uri: uri) {
  return {
    statusCode: 302,
    headers: {
      Location: uri
    }
  };
}

export class HttpClient {

  doHttp(options: any): Promise<any> {
    return new Promise<any>((respond, reject) => {
      request(options, (err, res, body) => {
        if (res && res.statusCode == 200) {
          respond(body);
        } else {
          console.log("Failure: " + body);
          if (err) {
            reject(err);
          } else {
            reject(body);
          }
        }
      });
    });
  }

}
