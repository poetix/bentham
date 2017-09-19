export type event = any
export type callback = (err: any, res: any) => void
export type uri = string
export type host = string

export type accessCode = string
export type accountId = string
export type userId = string
export type accessToken = string

export interface accountAccessToken {
  accountId: accountId;
  accessToken: accessToken;
}

export type clientId = string
export type clientSecret = string

export type challenge = string

export type cursor = string
export type fileInfo = any
export type response = any
