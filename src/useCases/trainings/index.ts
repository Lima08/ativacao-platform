import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { IMediaCreated } from 'interfaces/entities/media'
import { ITrainingCreated, ITrainingFilter } from 'interfaces/entities/training'
import { prisma } from 'lib/prisma'
import { Training } from 'models/Training'

import { updateMedia, getMediasBy, deleteMedia } from '../media'
import { createdTrainingDto, newTrainingDto, modifierTrainingDto } from './dto'

const repository = Training.of(prisma)

async function createTraining({
  name,
  description,
  companyId,
  userId,
  mediaIds
}: newTrainingDto): Promise<any> {
  const newTraining = await repository
    .create({
      name,
      description,
      companyId,
      userId
    })
    .catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error creating Training',
        HTTP_STATUS.BAD_REQUEST,
        meta
      )
    })

  let medias: IMediaCreated[] = []

  if (newTraining && !!mediaIds?.length) {
    const promises = mediaIds.map((mediaId) =>
      updateMedia(mediaId, { trainingId: newTraining.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta || error.message
        throw new CustomError(
          'Error in creating Training media',
          HTTP_STATUS.BAD_REQUEST,
          {
            ...meta,
            createdTraining: newTraining
          }
        )
      })
  }

  return { ...newTraining, medias }
}

async function getTrainingById(id: string): Promise<createdTrainingDto> {
  try {
    const training = await repository.getOneBy(id)

    let medias: IMediaCreated[] = []
    if (training) {
      medias = await getMediasBy({ trainingId: training.id })
    }

    return { ...training, medias }
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get Training',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function getAllTrainings(
  filter: ITrainingFilter
): Promise<ITrainingCreated[]> {
  try {
    const allTrainings = await repository.getAll(filter)
    const allTrainingsWithMedia: ITrainingCreated[] = []

    for (const training of allTrainings) {
      const medias = await getMediasBy({ trainingId: training.id })

      allTrainingsWithMedia.push({ ...training, medias: medias || [] })
    }

    return allTrainingsWithMedia
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get Trainings',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function updateTraining(
  id: string,
  { name, description, mediaIds, active }: modifierTrainingDto
): Promise<createdTrainingDto> {
  const updatedTraining = await repository
    .update(id, { name, description, active })
    .catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error to update Training',
        HTTP_STATUS.BAD_REQUEST,
        meta
      )
    })

  let medias: IMediaCreated[] = []

  if (mediaIds?.length) {
    const promises = mediaIds.map((id) =>
      updateMedia(id, { trainingId: updatedTraining.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta || error.message
        throw new CustomError(
          'Error to update Training media',
          HTTP_STATUS.BAD_REQUEST,
          meta
        )
      })
  }

  return { ...updatedTraining, medias }
}
async function toggleActive(id: string): Promise<createdTrainingDto> {
  const training = await repository.getOneBy(id)

  await repository
    .update(id, { active: !training.active })
    .catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error to update Training',
        HTTP_STATUS.BAD_REQUEST,
        meta
      )
    })

  let medias: IMediaCreated[] = []
  if (training) {
    medias = await getMediasBy({ trainingId: training.id })
  }

  return { ...training, active: !training.active, medias }
}

async function deleteTraining(id: string): Promise<void> {
  const allMedias = await getMediasBy({ trainingId: id })
  if (allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error to delete Training media',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        meta
      )
    })
  }

  await repository.delete(id).catch((error: any) => {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to delete Training',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  })
}

export {
  createTraining,
  getTrainingById,
  getAllTrainings,
  updateTraining,
  deleteTraining,
  toggleActive
}
