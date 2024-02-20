import {
  S3Client,
  GetObjectRequest,
  GetObjectOutput,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectOutput
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
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

  public async createPresignedUrl({
    bucket,
    key
  }: Record<string, any>): Promise<any> {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key })
    const client = getS3Client()
    try {
      // @ts-ignore
      return getSignedUrl(client, command, { expiresIn: 3600 })
    } catch (error: any) {
      console.error(error)
    }
  }

  public async getObject(params: GetObjectRequest): Promise<GetObjectOutput> {
    const command = new GetObjectCommand(params)

    try {
      return this.s3Client.send(command)
    } catch (error: any) {
      throw new CustomError(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        ...params,
        error
      })
    }
  }

  public async putObject({
    bucket,
    key,
    body,
    contentType
  }: IPutObject): Promise<PutObjectOutput> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
    try {
      return this.s3Client.send(command)
    } catch (error: any) {
      throw new CustomError(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        bucket,
        key,
        error
      })
    }
  }

  public async deleteObject({ bucket, key }: IDeleteObject): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })

    try {
      await this.s3Client.send(command)
    } catch (error: any) {
      throw new CustomError(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        bucket,
        key,
        error
      })
    }
  }
}
