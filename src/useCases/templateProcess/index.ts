import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import { extractS3Key } from 'functions'
import {
  ITemplateProcess,
  ITemplateProcessCreated,
  ITemplateProcessFilter
} from 'interfaces/entities/templateProcess'
import { prisma } from 'lib/prisma'
import { TemplateProcess } from 'models/TemplateProcess'
import s3Service from 'services/s3Service'

dotenv.config()
const repository = TemplateProcess.of(prisma)

async function createTemplateProcess({
  title,
  bucketUrl,
  companyId
}: ITemplateProcess): Promise<ITemplateProcessCreated> {
  try {
    const newTemplateProcess = await repository.create({
      title,
      bucketUrl,
      companyId
    })
    return newTemplateProcess
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to create template process',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getTemplateProcessById(
  id: string
): Promise<ITemplateProcessCreated> {
  try {
    const templateProcess = await repository.get(id)
    return templateProcess
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get template process',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

async function getAllTemplateProcesses(filter: ITemplateProcessFilter): Promise<ITemplateProcessCreated[]> {
  try {
    const templateProcesses = await repository.getAll(filter)

    return templateProcesses
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get template process',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateTemplateProcessTitle(
  id: string,
  title: ITemplateProcess['title']
): Promise<ITemplateProcessCreated> {
  const updatedTemplateProcess: ITemplateProcessCreated = await repository
    .update(id, { title })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar modelo de processo',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  return updatedTemplateProcess
}

async function deleteTemplateProcess(id: string): Promise<void> {
  const bucketService = s3Service.getInstance()
  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_DOC!

  const TemplateProcess = await repository.get(id)
  if (!TemplateProcess) {
    throw new CustomError('TemplateProcess not found', HTTP_STATUS.BAD_REQUEST)
  }

  const errors: any[] = []
  await bucketService
    .deleteObject({
      bucket,
      key: extractS3Key(bucket, TemplateProcess.bucketUrl)
    })
    .catch((error) => {
      console.error(error)
      errors.push(error)
    })

  await repository.delete(id).catch((error) => {
    console.error(error)
    throw new CustomError(
      error.message || 'Erro ao deletar modelo de processo',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      { ...error, ...errors }
    )
  })
}

export {
  createTemplateProcess,
  getTemplateProcessById,
  deleteTemplateProcess,
  updateTemplateProcessTitle,
  getAllTemplateProcesses
}
