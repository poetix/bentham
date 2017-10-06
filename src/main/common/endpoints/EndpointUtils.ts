import { callback } from "../Api";

/**
 Takes a Promise, and uses it to complete a callback.
 */
export const complete = <T>(cb: callback, p: Promise<T>) => {
  return p.then(res => cb(null, res), err => cb(null, {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(err)
  }));
};

export const response = (statusCode: number, bodyObject: any) => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify(bodyObject)
})
