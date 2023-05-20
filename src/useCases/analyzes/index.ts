import CustomError from 'errors/CustomError'
import {
  IAnalysis,
  IAnalysisCreated,
  IAnalysisFilter,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { prisma } from 'lib/prisma'
import { Analysis } from 'models/Analysis'


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
  { biUrl, status, title }: IAnalysisModifier
): Promise<IAnalysisCreated> {
  const updatedAnalysis = await repository
    .update(id, { biUrl, status, title })
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

async function done(
  id: string,
  { biUrl }: IAnalysisModifier
): Promise<IAnalysisCreated> {
  const updatedAnalysis = await repository
    .update(id, { biUrl, status: 'done' })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update Analysis', 400, meta)
    })

  return updatedAnalysis
}

async function rejected(id: string): Promise<IAnalysisCreated> {
  const updatedAnalysis = await repository
    .update(id, { status: 'rejected', biUrl: '' })
    .catch((error: any) => {
      const meta = error.meta
      throw new CustomError('Error to update Analysis', 400, meta)
    })

  return updatedAnalysis
}

export {
  createAnalysis,
  getAnalysisById,
  getAllAnalyzes,
  updateAnalysis,
  deleteAnalysis,
  done,
  rejected
}
