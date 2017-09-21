const request = require('request');

import { host, uri } from "../Api";

export const pathTo = (host: host, path: string): uri => `https://${host}/dev/${path}`;

export const redirectTo = (uri: uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    }
  });

  export const doHttp = (options: any): Promise<any> => {
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
  };
