import { callback } from "../Api";

/**
 Takes a Promise, and uses it to complete a callback.
 */
export const complete = <T>(cb: callback, p: Promise<T>) => {
  return p.then(res => cb(null, res), err => cb(err, null));
};
