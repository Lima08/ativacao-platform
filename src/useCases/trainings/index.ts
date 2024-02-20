import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import { IMediaCreated } from 'interfaces/entities/media'
import { ITrainingCreated, ITrainingFilter } from 'interfaces/entities/training'
import { prisma } from 'lib/prisma'
import { Training } from 'models/Training'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getUsers } from 'useCases/users'

import { updateMedia, getMediasBy, deleteMedia } from '../media'
import { createdTrainingDto, newTrainingDto, modifierTrainingDto } from './dto'

const repository = Training.of(prisma)

async function createTraining({
  name,
  description,
  companyId,
  userId,
  mediaIds
}: newTrainingDto): Promise<ITrainingCreated> {
  try {
    const newTraining = await repository.create({
      name,
      description,
      companyId,
      userId
    })
    if (!newTraining)
      throw new CustomError(
        'Error Ao criar treinamento',
        HTTP_STATUS.BAD_REQUEST
      )

    let medias: IMediaCreated[] = []
    if (newTraining && !!mediaIds?.length) {
      const promises = mediaIds.map((mediaId) =>
        updateMedia(mediaId, { trainingId: newTraining.id })
      )

      await Promise.all(promises)
        .then((files) => (medias = files))
        .catch((error: any) => {
          throw new CustomError(
            'Erro ao criar mídias',
            HTTP_STATUS.BAD_REQUEST,
            error
          )
        })
    }

    const companyUsers = await getUsers({ companyId })
    const userEmailList = companyUsers.map((user) => user.email)

    const emailTemplatePath = path.resolve(
      'src/templates/newContentNotify.html'
    )
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
    const title = 'Novidade no site!'

    const variables = {
      moduleName: 'Treinamento',
      contentName: name,
      contentDescription: description,
      contentUrl: `https://ativacaotec.com/in/trainings/${newTraining.id}`
    }

    const compiledEmail = EmailService.getInstance().compileTemplate(
      emailTemplate,
      variables
    )

    await EmailService.getInstance()
      .sendEmailBulk(userEmailList, title, compiledEmail)
      .catch((error) => console.error(error))

    return { ...newTraining, medias }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Ao criar treinamento',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
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
    throw new CustomError(
      error.message || 'Error to get Training',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
    throw new CustomError(
      error.message || 'Error to get Trainings',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateTraining(
  id: string,
  { name, description, mediaIds, active, mediasToExclude }: modifierTrainingDto
): Promise<createdTrainingDto> {
  const updatedTraining = await repository
    .update(id, { name, description, active })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        error.message || 'Erro ao atualizar treinamento',
        error.code || HTTP_STATUS.BAD_REQUEST,
        error
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
        throw new CustomError(
          error.message || 'Erro ao atualizar mídias',
          error.code || HTTP_STATUS.BAD_REQUEST,
          error
        )
      })
  }

  let promisesToExclude: any[] = []
  if (mediasToExclude?.length) {
    promisesToExclude = mediasToExclude.map((id) => deleteMedia(id))
  }

  await Promise.all(promisesToExclude).catch((error: any) => {
    throw new CustomError(
      error.message || 'Erro ao deletar mídia',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  })

  return { ...updatedTraining, medias }
}

async function toggleActive(id: string): Promise<createdTrainingDto> {
  const training = await repository.getOneBy(id)

  await repository
    .update(id, { active: !training.active })
    .catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to update Training',
        error.code || HTTP_STATUS.BAD_REQUEST,
        error
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
      throw new CustomError(
        error.message || 'Error ao deletar treinamento',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }

  await repository.delete(id).catch((error: any) => {
    const meta = error.meta || error.message
    throw new CustomError(
      error.message || 'Erro ao deletar treinamento',
      error.code || HTTP_STATUS.BAD_REQUEST,
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
