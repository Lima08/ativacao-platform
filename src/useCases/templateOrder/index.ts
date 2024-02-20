import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import { extractS3Key } from 'functions'
import {
  ITemplateOrder,
  ITemplateOrderCreated,
  ITemplateOrderFilter
} from 'interfaces/entities/templateOrder'
import { prisma } from 'lib/prisma'
import { TemplateOrder } from 'models/TemplateOrder'
import s3Service from 'services/s3Service'

dotenv.config()
const repository = TemplateOrder.of(prisma)

async function createTemplateOrder({
  title,
  bucketUrl,
  companyId
}: ITemplateOrder): Promise<ITemplateOrderCreated> {
  try {
    const newTemplateOrder = await repository.create({
      title,
      bucketUrl,
      companyId
    })
    return newTemplateOrder
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to create template Order',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getTemplateOrderById(
  id: string
): Promise<ITemplateOrderCreated> {
  try {
    const templateOrder = await repository.get(id)
    return templateOrder
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get template order',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

async function getAllTemplateOrder(
  filter: ITemplateOrderFilter
): Promise<ITemplateOrderCreated[]> {
  try {
    const templateOrder = await repository.getAll(filter)

    return templateOrder
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get template order',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateTemplateOrderTitle(
  id: string,
  title: ITemplateOrder['title']
): Promise<ITemplateOrderCreated> {
  const updatedTemplateOrder: ITemplateOrderCreated = await repository
    .update(id, { title })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar modelo',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  return updatedTemplateOrder
}

async function deleteTemplateOrder(id: string): Promise<void> {
  const bucketService = s3Service.getInstance()
  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_DOC!

  const templateOrder = await repository.get(id)
  if (!templateOrder) {
    throw new CustomError('Template order not found', HTTP_STATUS.BAD_REQUEST)
  }

  const errors: any[] = []
  await bucketService
    .deleteObject({
      bucket,
      key: extractS3Key(bucket, templateOrder.bucketUrl)
    })
    .catch((error) => {
      console.error(error)
      errors.push(error)
    })

  await repository.delete(id).catch((error) => {
    console.error(error)
    throw new CustomError(
      error.message || 'Erro ao deletar modelo',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      { ...error, ...errors }
    )
  })
}

export {
  createTemplateOrder,
  getTemplateOrderById,
  deleteTemplateOrder,
  updateTemplateOrderTitle,
  getAllTemplateOrder
}
