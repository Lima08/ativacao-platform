import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import { Media } from 'models/Media'
import CustomError from 'constants/errors/CustoError'
import {
  IMedia,
  IMediaCreated,
  IMediaFilter,
  IMediaModifier
} from 'interfaces/entities/media'

dotenv.config()
const repository = Media.of(prisma)

async function createMedia({
  type,
  campaignId,
  trainingId,
  url,
  key
}: IMedia): Promise<IMediaCreated> {
  if (!type) throw new Error('Type is required')

  let fileType: string
  if (['image', 'video'].includes(type)) {
    fileType = type
  } else {
    fileType = 'document'
  }

  try {
    const mediasFile = await repository.create({
      campaignId,
      trainingId,
      url,
      key,
      type: fileType
    })
    return mediasFile
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error creating media', 400, meta)
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
    const meta = error.meta
    throw new CustomError('Error to update media file', 400, meta)
  }
}

async function getMediasBy(filter: IMediaFilter): Promise<IMediaCreated[]> {
  try {
    const mediaFiles = await repository.getAll(filter)
    return mediaFiles
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get medias', 400, meta)
  }
}

async function deleteMedia(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error delete media', 400, meta)
  }
}

export { createMedia, updateMedia, getMediasBy, deleteMedia }
