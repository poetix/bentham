import { fileInfo, cursor } from "../Api";

export interface FileFetchResult {
  files: Array<fileInfo>
  newCursor?: cursor
}

export interface UserDetails {
  userName: string
}
