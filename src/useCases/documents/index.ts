import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import {
  IDocument,
  IDocumentCreated,
  IDocumentFilter,
  IDocumentModifier
} from 'interfaces/entities/document'
import { prisma } from 'lib/prisma'
import { Document } from 'models/Document'
import s3Service from 'services/s3Service'

dotenv.config()
const repository = Document.of(prisma)

async function createDocument({
  url,
  key
}: IDocument): Promise<IDocumentCreated> {
  try {
    const documentsFile = await repository.create({
      url,
      key
    })
    return documentsFile
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error creating document',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function updateDocument(
  id: string,
  params: IDocumentModifier
): Promise<IDocumentCreated> {
  try {
    const updatedDocument = await repository.update(id, params)
    return updatedDocument
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError('Error to update document file', 400, meta)
  }
}

async function getDocument(id: string): Promise<IDocumentCreated> {
  try {
    const documentFiles = await repository.get(id)
    return documentFiles
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get documents',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

async function getDocumentBy(
  filter: IDocumentFilter
): Promise<IDocumentCreated[]> {
  try {
    const documents = await repository.getAll(filter)
    return documents
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get documents',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

async function deleteDocument(id: string): Promise<void> {
  const bucketService = s3Service.getInstance()

  const document = await repository.get(id)
  if (!document)
    throw new CustomError('document not found', HTTP_STATUS.BAD_REQUEST)
  const errors: any[] = []
  await bucketService
    .deleteObject({
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_DOC!,
      key: document.key
    })
    .catch((error) => {
      console.error(error)
      errors.push(error)
    })

  await repository.delete(id).catch((error) => {
    console.error(error)
    throw new CustomError(
      error.message || 'Erro ao deletar documento',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      { ...error, ...errors }
    )
  })
}

export {
  createDocument,
  getDocument,
  deleteDocument,
  updateDocument,
  getDocumentBy
}
