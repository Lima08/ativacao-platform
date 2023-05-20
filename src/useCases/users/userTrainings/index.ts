import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import dotenv from 'dotenv'
import CustomError from 'errors/CustomError'
import type {
  IUserTraining,
  IUserTrainingCreated,
  IUserTrainingFilter,
  IUserTrainingModifier
} from 'interfaces/entities/userTraining'
import { prisma } from 'lib/prisma'
import { UserTraining } from 'models/UserTraining '

dotenv.config()
const repository = UserTraining.of(prisma)

async function start({
  trainingId,
  userId
}: IUserTraining): Promise<IUserTrainingCreated> {
  const allStartedTrainings = await repository.getAll({ trainingId, userId })

  if (allStartedTrainings.length) {
    throw new CustomError('Training already started', HTTP_STATUS.FORBIDDEN)
  }

  const userTraining = await repository
    .start({ trainingId, userId })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError(
        'Error to start the training',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        meta
      )
    })

  return userTraining
}

async function getAllBy(
  filter: IUserTrainingFilter
): Promise<IUserTrainingCreated[]> {
  try {
    const allStartedTrainings = await repository.getAll(filter)
    return allStartedTrainings
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(
      'Error to get trainings',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

async function updateStatus(
  id: string,
  params: IUserTrainingModifier
): Promise<IUserTrainingCreated> {
  if (!params.status)
    throw new CustomError('Status is required', HTTP_STATUS.BAD_REQUEST)

  if (!['finished'].includes(params.status))
    throw new CustomError('Invalid status', HTTP_STATUS.BAD_REQUEST)

  try {
    const updatedUserTraining = await repository.update(id, params)
    return updatedUserTraining
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(
      `Error to update training status`,
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

export { start, getAllBy, updateStatus }
