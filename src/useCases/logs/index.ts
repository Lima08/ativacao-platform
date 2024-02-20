import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { ILog } from 'interfaces/entities/log/ILog'
import { ILogCreated } from 'interfaces/entities/log/ILogCreated'
import { ILogFilter } from 'interfaces/entities/log/ILogFilter'
import { ILogModifier } from 'interfaces/entities/log/ILogModifier'
import { prisma } from 'lib/prisma'
import { Log } from 'models/Log'

const repository = Log.of(prisma)

async function createLog({
  userId,
  trainingId,
  campaignId,
  module,
  info,
  totalMedias,
  mediasWatched
}: ILog): Promise<ILogCreated> {
  try {
    const newLog = await repository.create({
      userId,
      trainingId,
      campaignId,
      module,
      info,
      totalMedias,
      mediasWatched
    })
    if (!newLog)
      throw new CustomError('Error Ao criar log', HTTP_STATUS.BAD_REQUEST)

    return { ...newLog }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Ao criar lg',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getLogById(id: string): Promise<ILogCreated> {
  try {
    const log = await repository.getOneBy(id)

    return log
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get log',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function findFirstBy(filters: ILogFilter): Promise<ILogCreated> {
  try {
    const log = await repository.findFirst(filters)

    return log
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get log',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getAllLogs(filter: ILogFilter): Promise<ILogCreated[]> {
  try {
    const allLogs = await repository.getAll(filter)

    return allLogs
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get logs',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateLog(
  id: string,
  { module, info, totalMedias, mediasWatched }: ILogModifier
): Promise<ILogCreated> {
  const updatedLog = await repository
    .update(id, { module, info, totalMedias, mediasWatched })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        error.message || 'Erro ao atualizar log',
        error.code || HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  return updatedLog
}

async function deleteLog(id: string): Promise<void> {
  await repository.delete(id).catch((error: any) => {
    const meta = error.meta || error.message
    throw new CustomError(
      error.message || 'Erro ao deletar log',
      error.code || HTTP_STATUS.BAD_REQUEST,
      meta
    )
  })
}

export { createLog, getLogById, getAllLogs, updateLog, deleteLog, findFirstBy }
