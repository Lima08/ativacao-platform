import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import { Media } from 'models/Media'
import { IMedia, IMediaCreated, IMediaFilter } from 'interfaces/entities/media'
import CustomError from 'constants/errors/CustoError'

dotenv.config()
const MediaRepository = Media.of(prisma)

async function create(params: IMedia): Promise<IMediaCreated> {
  try {
    const mediasFile = await MediaRepository.create(params)
    return mediasFile
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error creating media', 400, meta)
  }
}

async function getAll(filter: IMediaFilter): Promise<IMediaCreated[]> {
  try {
    const mediaFiles = await MediaRepository.getAll(filter)
    return mediaFiles
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error get medias files', 400, meta)
  }
}

async function deleteOne(id: string): Promise<void> {
  try {
    await MediaRepository.delete(id)
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error delete media', 400, meta)
  }
}

export { create, getAll, deleteOne }
