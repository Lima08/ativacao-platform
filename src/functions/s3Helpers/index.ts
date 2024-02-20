export const generateS3FileUrl = (bucket: string, key: string) => {
  const s3BaseUrl = `https://${bucket}.s3.amazonaws.com`
  const fileUrl = `${s3BaseUrl}/${encodeURIComponent(key)}`
  return fileUrl
}
export const extractS3Key = (bucket: string, url: string) => {
  const s3BaseUrl = `https://${bucket}.s3.amazonaws.com`
  const key = url.substring(s3BaseUrl.length + 1)
  return key
}
