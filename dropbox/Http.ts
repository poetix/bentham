import { event, uri } from "./Api"

export const pathTo = (event: event, path: string): uri => `https://${event.headers.Host}/dev/${path}`;

export const redirectTo = (uri: uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    }
  });
