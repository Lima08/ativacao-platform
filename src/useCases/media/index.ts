import { HttpStatusCode } from 'axios'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import {
  IMedia,
  IMediaCreated,
  IMediaFilter,
  IMediaModifier
} from 'interfaces/entities/media'
import { prisma } from 'lib/prisma'
import { Media } from 'models/Media'
import s3Service from 'services/s3Service'

dotenv.config()
const repository = Media.of(prisma)

async function createMedia({
  type,
  campaignId,
  trainingId,
  processId,
  url,
  key,
  cover
}: IMedia): Promise<IMediaCreated> {
  if (!type)
    throw new CustomError('O tipo é obrigatório', HttpStatusCode.BadRequest)

  try {
    const mediasFile = await repository.create({
      campaignId,
      trainingId,
      processId,
      url,
      key,
      type,
      cover
    })
    return mediasFile
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error creating media',
      HttpStatusCode.BadRequest,
      error
    )
  }
}

async function updateMedia(
  id: string,
  params: IMediaModifier
): Promise<IMediaCreated> {
  try {
    const updatedMedia = await repository.update(id, params)
    return updatedMedia
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to update media file',
      HttpStatusCode.BadRequest,
      meta
    )
  }
}

async function getMediasBy(filter: IMediaFilter): Promise<IMediaCreated[]> {
  try {
    const mediaFiles = await repository.getAll(filter)
    const filteredMediaFiles = mediaFiles.map(
      ({
        id,
        url,
        type,
        key,
        campaignId,
        trainingId,
        processId,
        catalogId,
        cover
      }) => ({
        id,
        url,
        type,
        key,
        campaignId,
        trainingId,
        processId,
        catalogId,
        cover
      })
    )
    return filteredMediaFiles
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get medias',
      HttpStatusCode.BadRequest,
      meta
    )
  }
}

async function deleteMedia(id: string): Promise<void> {
  const bucketService = s3Service.getInstance()

  const media = await repository.get(id)
  if (!media)
    throw new CustomError('Media not found', HttpStatusCode.BadRequest)
  const errors: any[] = []
  await bucketService
    .deleteObject({
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_MEDIA!,
      key: media.key
    })
    .catch((error) => {
      console.error(error)
      errors.push(error)
    })

  await repository.delete(id).catch((error) => {
    console.error(error)
    throw new CustomError(
      error.message || 'Erro ao deletar mídia',
      HttpStatusCode.InternalServerError,
      { ...error, ...errors }
    )
  })
}

export { createMedia, updateMedia, getMediasBy, deleteMedia }
