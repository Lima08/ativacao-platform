import dotenv from 'dotenv'
import { prisma } from 'lib/prisma'
import type {
  IUserTraining,
  IUserTrainingCreated,
  IUserTrainingFilter,
  IUserTrainingModifier
} from 'interfaces/entities/userTraining'
import CustomError from 'constants/errors/CustoError'
import { UserTraining } from 'models/UserTraining '

dotenv.config()
const repository = UserTraining.of(prisma)

async function start({
  trainingId,
  userId
}: IUserTraining): Promise<IUserTrainingCreated> {
  const allStartedTrainings = await repository.getAll({ trainingId, userId })

  if (!!allStartedTrainings.length) {
    throw new CustomError('Training already started', 403)
  }

  const userTraining = await repository
    .start({ trainingId, userId })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to start the training', 500, meta)
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
    throw new CustomError('Error to get trainings', 400, meta)
  }
}

async function updateStatus(
  id: string,
  params: IUserTrainingModifier
): Promise<IUserTrainingCreated> {
  if (!params.status) throw new CustomError('Status is required', 400)
  if (!['finished'].includes(params.status))
    throw new CustomError('Invalid status', 400)

  try {
    const updatedUserTraining = await repository.update(id, params)
    return updatedUserTraining
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError(`Error to update training status`, 400, meta)
  }
}

export { start, getAllBy, updateStatus }
