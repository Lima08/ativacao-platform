import { prisma } from 'lib/prisma'
import { Analysis } from 'models/Analysis'
import { updateMedia, getMediasBy, deleteMedia } from '../media'
import CustomError from 'constants/errors/CustoError'
import {
  IAnalysis,
  IAnalysisCreated,
  IAnalysisFilter,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { IMediaCreated } from 'interfaces/entities/media'

const repository = Analysis.of(prisma)

async function createAnalysis({
  title,
  userId,
  bucketUrl,
  biUrl
}: IAnalysis): Promise<IAnalysisCreated> {
  const newAnalysis = await repository
    .create({
      title,
      userId,
      bucketUrl,
      biUrl
    })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error creating Analysis', 500, meta)
    })

  return newAnalysis
}

async function getAnalysisById(id: string): Promise<IAnalysisCreated> {
  try {
    const analysis = await repository.getOneBy(id)

    return analysis
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get Analysis', 500, meta)
  }
}

async function getAllAnalyzes(
  filter: IAnalysisFilter
): Promise<IAnalysisCreated[]> {
  try {
    const newAnalyzes = await repository.getAll(filter)
    return newAnalyzes
  } catch (error: any) {
    const meta = error.meta
    throw new CustomError('Error to get Analyzes', 500, meta)
  }
}

async function updateAnalysis(
  id: string,
  { biUrl, status }: IAnalysisModifier
): Promise<IAnalysisCreated> {
  const updatedAnalysis = await repository
    .update(id, { biUrl, status })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update Analysis', 400, meta)
    })

  return updatedAnalysis
}

async function deleteAnalysis(id: string): Promise<void> {
  await repository.delete(id).catch((error: any) => {
    const meta = error.meta
    throw new CustomError('Error to delete Analysis', 400, meta)
  })
}

export {
  createAnalysis,
  getAnalysisById,
  getAllAnalyzes,
  updateAnalysis,
  deleteAnalysis
}