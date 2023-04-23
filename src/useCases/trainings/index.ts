import { prisma } from 'lib/prisma'
import { Training } from 'models/Training'
import { updateMedia, getMediasBy, deleteMedia } from '../media'
import CustomError from 'constants/errors/CustoError'
import { ITrainingCreated, ITrainingFilter } from 'interfaces/entities/training'
import { createdTrainingDto, newTrainingDto, modifierTrainingDto } from './dto'
import { IMediaCreated } from 'interfaces/entities/media'

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
      const meta = error.meta
      throw new CustomError('Error creating Training', 400, meta)
    })

  let medias: IMediaCreated[] = []

  if (newTraining && !!mediaIds?.length) {
    const promises = mediaIds.map((mediaId) =>
      updateMedia(mediaId, { trainingId: newTraining.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta
        throw new CustomError('Error in creating Training media', 400, {
          ...meta,
          createdTraining: newTraining
        })
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
    const meta = error.meta
    throw new CustomError('Error to get Training', 500, meta)
  }
}

async function getAllTrainings(
  filter: ITrainingFilter
): Promise<ITrainingCreated[]> {
  try {
    const newTrainings = await repository.getAll(filter)
    return newTrainings
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get Trainings', 500, meta)
  }
}

async function updateTraining(
  id: string,
  { name, description, mediaIds }: modifierTrainingDto
): Promise<createdTrainingDto> {
  const updatedTraining = await repository
    .update(id, { name, description })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update Training', 400, meta)
    })

  let medias: IMediaCreated[] = []

  if (!!mediaIds?.length) {
    const promises = mediaIds.map((id) =>
      updateMedia(id, { trainingId: updatedTraining.id })
    )

    await Promise.all(promises)
      .then((files) => (medias = files))
      .catch((error: any) => {
        const meta = error.meta
        throw new CustomError('Error to update Training media', 400, meta)
      })
  }

  return { ...updatedTraining, medias }
}

async function deleteTraining(id: string): Promise<void> {
  const allMedias = await getMediasBy({ trainingId: id })
  if (!!allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to delete Training media', 500, meta)
    })
  }

  await repository.delete(id).catch((error: any) => {
    const meta = error.meta
    throw new CustomError('Error to delete Training', 400, meta)
  })
}

export {
  createTraining,
  getTrainingById,
  getAllTrainings,
  updateTraining,
  deleteTraining
}
