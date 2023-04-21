export interface IUpload {
  Bucket: string
  Key: string
  body: Buffer
  ContentType: string
}
