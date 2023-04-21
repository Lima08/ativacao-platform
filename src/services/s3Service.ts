import {
  GetObjectRequest,
  GetObjectOutput,
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
  // DeleteBucketCommand
} from '@aws-sdk/client-s3'
import { getS3Client } from '../lib/s3'
import { IUpload } from 'interfaces/services/IUpload'

export default class s3Service {
  private static instance: s3Service
  private s3Client: S3Client

  private constructor() {
    this.s3Client = getS3Client()
  }

  public static getInstance(): s3Service {
    if (!s3Service.instance) {
      s3Service.instance = new s3Service()
    }
    return s3Service.instance
  }

  public async getObject(params: GetObjectRequest): Promise<GetObjectOutput> {
    const command = new GetObjectCommand(params)

    try {
      const s3Object = await this.s3Client.send(command)
      return s3Object
    } catch (error) {
      throw error
    }
  }

  public async putObject(params: IUpload): Promise<string> {
    const command = new PutObjectCommand(params)
    try {
      await this.s3Client.send(command)
      return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
    } catch (error) {
      throw error
    }
  }

//   public async deleteObject(bucketName, objectUrl): Promise<void> {

// const key = o

//     const command = new DeleteBucketCommand({
//       Bucket: bucketName,
//       Key: objectKey
//     })
//     try {
//       await this.s3Client.send(command)
//     } catch (error) {
//       throw error
//     }
//   }
}
