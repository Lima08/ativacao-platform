import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { readFileSync } from 'fs'
import { IDocumentCreated } from 'interfaces/entities/document'
import {
  IOrderCreated,
  IOrderFilter,
  IOrderModifier
} from 'interfaces/entities/Order'
import { prisma } from 'lib/prisma'
import { Order } from 'models/Order'
import path from 'path'
import EmailService from 'services/emailService/EmailService'
import { getCompanyById } from 'useCases/companies'
import { getUserById } from 'useCases/users'

import { updateDocument, deleteDocument, getDocumentBy } from '../documents'
import { createdOrderDto, newOrderDto } from './dto'

const repository = Order.of(prisma)

const ORDER_STATUS_MAP = {
  received: 'foi recebido',
  processing: 'esta em separação',
  rejected: 'foi rejeitado',
  invoiced: 'foi faturado'
}

async function createOrder({
  templateOrderId,
  companyId,
  userId,
  title,
  documentIds
}: newOrderDto): Promise<createdOrderDto> {
  const titleRef = title
  try {
    const newOrder = await repository.create({
      templateOrderId,
      companyId,
      userId,
      title: titleRef
    })

    if (!newOrder)
      throw new CustomError('Erro ao criar pedido', HTTP_STATUS.BAD_REQUEST)
    let documents: IDocumentCreated[] = []
    if (newOrder && documentIds?.length) {
      const promises = documentIds.map((documentId) =>
        updateDocument(documentId, { orderId: newOrder.id })
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

    const company = await getCompanyById(newOrder.companyId)
    const emailTemplatePath = path.resolve('src/templates/newOrder.html')
    const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')

    const variables = {
      title: newOrder.title,
      companyName: company.name,
      contentUrl: `https://ativacaotec.com/in/orders`
    }

    const compiledEmail = EmailService.getInstance().compileTemplate(
      emailTemplate,
      variables
    )
    const contacts = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_CONTACT!)

    for (const contact of contacts) {
      await EmailService.getInstance()
        .sendEmail(contact, `Novo pedido! - ${company.name}`, compiledEmail)
        .catch((error) => console.error(error))
    }

    return { ...newOrder, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar pedido',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getOrderById(id: string): Promise<createdOrderDto> {
  try {
    const order = await repository.get(id)
    let documents: IDocumentCreated[] = []
    if (order) {
      documents = await getDocumentBy({ orderId: order.id })
    }
    return { ...order, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get order',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getAllOrder(filter: IOrderFilter): Promise<createdOrderDto[]> {
  try {
    const allOrder = await repository.getAll(filter)
    const allOrderWithDocuments: createdOrderDto[] = []
    for (const order of allOrder) {
      const documents = await getDocumentBy({ orderId: order.id })
      allOrderWithDocuments.push({ ...order, documents })
    }
    return allOrderWithDocuments
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get order',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateOrder(
  id: string,
  { title, message, status }: IOrderModifier
): Promise<IOrderCreated> {
  const updatedOrder = await repository
    .update(id, { title, message, status })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar pedido',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })
  const user = await getUserById(updatedOrder.userId)

  const emailTemplatePath = path.resolve('src/templates/orderUpdated.html')
  const emailTemplate = readFileSync(emailTemplatePath, 'utf-8')

  const variables = {
    orderName: updatedOrder.title,
    orderStatus: ORDER_STATUS_MAP[updatedOrder.status],
    orderDescription: message
  }

  const compiledEmail = EmailService.getInstance().compileTemplate(
    emailTemplate,
    variables
  )

  await EmailService.getInstance()
    .sendEmail(
      user.email,
      'Atualização de pedido - Ativação Tec',
      compiledEmail
    )
    .catch((error) => console.error(error))

  return updatedOrder
}

async function deleteOrder(id: string): Promise<void> {
  const allDocument = await getDocumentBy({ orderId: id })
  if (allDocument.length) {
    const promises = allDocument.map((document) => deleteDocument(document.id))
    await Promise.all(promises).catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to delete document from order',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }
  await repository.delete(id).catch((error: any) => {
    throw new CustomError(
      'Erro ao deletar pedido',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  })
}

export { createOrder, getOrderById, getAllOrder, updateOrder, deleteOrder }
