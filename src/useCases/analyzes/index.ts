import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import {
  IAnalysis,
  IAnalysisCreated,
  IAnalysisFilter,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { eAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'
import { prisma } from 'lib/prisma'
import { Analysis } from 'models/Analysis'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getCompanyById } from 'useCases/companies'
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
      throw new CustomError(
        'Erro ao criar análise',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })

  const emailTemplatePath = path.resolve('src/templates/analysisCreated.html')
  const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')
  const company = await getCompanyById(companyId)

  const variables = {
    title,
    bucketUrl,
    companyName: company.name || 'Empresa não informada'
  }

  const compiledEmail = EmailService.getInstance().compileTemplate(
    emailTemplate,
    variables
  )

  const contacts = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_CONTACT!)

  for (const contact of contacts) {
    EmailService.getInstance()
      .sendEmail(contact, 'Nova solicitação de análise!', compiledEmail)
      .catch((error) => {
        console.error(error)
      })
  }

  return newAnalysis
}

async function getAnalysisBy(id: string): Promise<IAnalysisCreated> {
  try {
    const analysis = await repository.getOneBy(id)

    return analysis
  } catch (error: any) {
    throw new CustomError(
      'Erro ao buscar análises',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
    throw new CustomError(
      'Erro ao buscar analises',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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

    const emailTemplatePath = path.resolve('src/templates/analysisUpdate.html')
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')

    const variables = {
      analysisName: updatedAnalysis.title,
      analysisStatus:
        updatedAnalysis.status === eAnalysisStatusType.done
          ? 'Finalizada'
          : 'Rejeitada',
      biUrl: updatedAnalysis.biUrl,
      analysisDescription: updatedAnalysis.message || 'Sem observações'
    }

    const compiledEmail = EmailService.getInstance().compileTemplate(
      emailTemplate,
      variables
    )

    await EmailService.getInstance()
      .sendEmail(user.email, 'Análise finalizada!', compiledEmail)
      .catch((error) => console.error(error))

    return updatedAnalysis
  } catch (error: any) {
    throw new CustomError(
      'Erro ao atualizar análise.',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function deleteAnalysis(id: string): Promise<void> {
  try {
    await repository.delete(id)
  } catch (error: any) {
    throw new CustomError(
      'Error ao deletar análises',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
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
