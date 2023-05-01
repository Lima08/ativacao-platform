import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import { Media } from 'models/Media'
import s3Service from 'services/s3Service'
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
  if (!type) throw new CustomError('Type is required', 400)

  try {
    const { mediasFile } = await repository.create({
      campaignId,
      trainingId,
      url,
      key,
      type
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
    const filteredMediaFiles = mediaFiles.map(
      ({ id, url, type, key, campaignId, trainingId }) => ({
        id,
        url,
        type,
        key,
        campaignId,
        trainingId
      })
    )
    return filteredMediaFiles
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get medias', 400, meta)
  }
}

async function deleteMedia(id: string): Promise<void> {
  const bucketService = s3Service.getInstance()

  const media = await repository.get(id)
  if (!media) throw new CustomError('Media not found', 400)

  await bucketService.deleteObject({
    bucket: process.env.AWS_BUCKET_MEDIA!,
    key: media.key
  })

  await repository.delete(id).catch((error) => {
    throw new CustomError('Fail to delete media', 500, error)
  })
}

export { createMedia, updateMedia, getMediasBy, deleteMedia }
