import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import { IDocumentCreated } from 'interfaces/entities/document'
import {
  IProcessCreated,
  IProcessFilter,
  IProcessModifier
} from 'interfaces/entities/process'
import { prisma } from 'lib/prisma'
import { Process } from 'models/Process'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getCompanyById } from 'useCases/companies'
import { getUserById } from 'useCases/users'

import { updateDocument, deleteDocument, getDocumentBy } from '../documents'
import { createdProcessDto, newProcessDto } from './dto'

const repository = Process.of(prisma)

const PROCESS_STATUS_MAP = {
  open: 'aberto',
  pending: 'iniciado',
  rejected: 'solicitado correção',
  done: 'finalizado'
}

async function createProcess({
  templateProcessId,
  companyId,
  userId,
  title,
  documentIds
}: newProcessDto): Promise<createdProcessDto> {
  const titleRef = title
  try {
    const newProcess = await repository.create({
      templateProcessId,
      companyId,
      userId,
      title: titleRef
    })

    if (!newProcess)
      throw new CustomError('Erro ao criar processo', HTTP_STATUS.BAD_REQUEST)
    let documents: IDocumentCreated[] = []
    if (newProcess && documentIds?.length) {
      const promises = documentIds.map((documentId) =>
        updateDocument(documentId, { processId: newProcess.id })
      )

      await Promise.all(promises)
        .then((files) => (documents = files))
        .catch((error: any) => {
          throw new CustomError(
            error.message || 'Erro ao salvar documentos',
            HTTP_STATUS.BAD_REQUEST,
            error
          )
        })
    }

    const company = await getCompanyById(newProcess.companyId)
    const emailTemplatePath = path.resolve('src/templates/processCreated.html')
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')

    const variables = {
      title: newProcess.title,
      companyName: company.name,
      contentUrl: `https://ativacaotec.com/in/processes`
    }

    const compiledEmail = EmailService.getInstance().compileTemplate(
      emailTemplate,
      variables
    )

    const contacts = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_CONTACT!)

    for (const contact of contacts) {
      await EmailService.getInstance()
        .sendEmail(contact, title, compiledEmail)
        .catch((error) => console.error(error))
    }

    return { ...newProcess, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar processo',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getProcessById(id: string): Promise<createdProcessDto> {
  try {
    const process = await repository.get(id)
    let documents: IDocumentCreated[] = []
    if (process) {
      documents = await getDocumentBy({ processId: process.id })
    }
    return { ...process, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get process',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getAllProcesses(
  filter: IProcessFilter
): Promise<createdProcessDto[]> {
  try {
    const allProcesses = await repository.getAll(filter)
    const allProcessesWithDocuments: createdProcessDto[] = []
    for (const process of allProcesses) {
      const documents = await getDocumentBy({ processId: process.id })
      allProcessesWithDocuments.push({ ...process, documents })
    }
    return allProcessesWithDocuments
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get Processes',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateProcess(
  id: string,
  { title, message, status }: IProcessModifier
): Promise<IProcessCreated> {
  const updatedProcess = await repository
    .update(id, { title, message, status })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar processo',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })
  const user = await getUserById(updatedProcess.userId)

  const emailTemplatePath = path.resolve('src/templates/processUpdate.html')
  const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')

  const variables = {
    ProcessName: updatedProcess.title,
    ProcessStatus: PROCESS_STATUS_MAP[updatedProcess.status],
    processDescription: message
  }

  const compiledEmail = EmailService.getInstance().compileTemplate(
    emailTemplate,
    variables
  )

  await EmailService.getInstance()
    .sendEmail(
      user.email,
      'Atualização de processo - Ativação Tec',
      compiledEmail
    )
    .catch((error) => console.error(error))

  return updatedProcess
}

async function deleteProcess(id: string): Promise<void> {
  const allDocument = await getDocumentBy({ processId: id })
  if (allDocument.length) {
    const promises = allDocument.map((document) => deleteDocument(document.id))
    await Promise.all(promises).catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to delete document from process',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }
  await repository.delete(id).catch((error: any) => {
    throw new CustomError(
      'Erro ao deletar processo',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  })
}

export {
  createProcess,
  getProcessById,
  getAllProcesses,
  updateProcess,
  deleteProcess
}
