export interface IPutObject {
  bucket: string
  key: string
  body: Buffer
  contentType: string
}
