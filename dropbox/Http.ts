export const pathTo = (event: any, path: string): string => `https://${event.headers.Host}/dev/${path}`;

export const redirectTo = (uri) => ({
    statusCode: 302,
    headers: {
      Location: uri
    }
  });
