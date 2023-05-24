import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import {
  IAnalysis,
  IAnalysisCreated,
  IAnalysisFilter,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { prisma } from 'lib/prisma'
import { Analysis } from 'models/Analysis'
import path from 'path'
import EmailService from 'services/emailService/IEmailService'
import { getUserById } from 'useCases/users'

const repository = Analysis.of(prisma)

async function createAnalysis({
  title,
  userId,
  companyId,
  bucketUrl,
  biUrl
}: IAnalysis): Promise<IAnalysisCreated> {
  const newAnalysis = await repository
    .create({
      title,
      userId,
      companyId,
      bucketUrl,
      biUrl
    })
    .catch((error: any) => {
      const meta = error.meta || error.message
      throw new CustomError(
        'Error creating Analysis',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        meta
      )
    })

  return newAnalysis
}

async function getAnalysisBy(id: string): Promise<IAnalysisCreated> {
  try {
    const analysis = await repository.getOneBy(id)

    return analysis
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get Analysis',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function getAllAnalyzes(
  filter: IAnalysisFilter
): Promise<IAnalysisCreated[]> {
  try {
    const newAnalyzes = await repository.getAll(filter)
    return newAnalyzes
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to get Analyzes',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      meta
    )
  }
}

async function updateAnalysis(
  id: string,
  modifierData: IAnalysisModifier
): Promise<IAnalysisCreated> {
  try {
    const updatedAnalysis = await repository.update(id, modifierData)
    const user = await getUserById(updatedAnalysis.userId)
    const emailTemplatePath = path.resolve(
      'src/utils/emailTemplates/analysisUpdate.html'
    )
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
    await EmailService.getInstance().sendEmail(
      user.email,
      'Análise atualizada!',
      emailTemplate
    )
    return updatedAnalysis
  } catch (error: any) {
    throw new Error(error)
  }
}

async function deleteAnalysis(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    const meta = error.meta || error.message
    throw new CustomError(
      'Error to delete Analysis',
      HTTP_STATUS.BAD_REQUEST,
      meta
    )
  }
}

export {
  createAnalysis,
  getAnalysisBy,
  getAllAnalyzes,
  updateAnalysis,
  deleteAnalysis
}
