import {
  S3Client,
  GetObjectRequest,
  GetObjectOutput,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectOutput
} from '@aws-sdk/client-s3'
import CustomError from 'constants/errors/CustoError'
import { IPutObject, IDeleteObject } from 'interfaces/services/'

import { getS3Client } from '../lib/s3'

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
      return this.s3Client.send(command)
    } catch (error) {
      console.log(
        '🚀 ~ file: s3Service.ts:36 ~ s3Service ~ getObject ~ error:',
        error
      )
      throw error
    }
  }

  public async putObject(params: IPutObject): Promise<PutObjectOutput> {
    const command = new PutObjectCommand({
      Bucket: params.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType
    })
    try {
      return this.s3Client.send(command)
    } catch (error) {
      console.log(
        '🚀 ~ file: s3Service.ts:54 ~ s3Service ~ putObject ~ error:',
        error
      )
      throw error
    }
  }

  public async deleteObject({ bucket, key }: IDeleteObject): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })

    await this.s3Client.send(command).catch(() => {
      throw new CustomError('Error to delete bucket object', 500, {
        bucket,
        key
      })
    })
  }
}
