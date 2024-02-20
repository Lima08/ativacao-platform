import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import {
  INotification,
  INotificationCreated,
  INotificationFilter,
  INotificationModifier
} from 'interfaces/entities/notification'
import { prisma } from 'lib/prisma'
import { Notification } from 'models/Notification'

const repository = Notification.of(prisma)

async function createNotification({
  title,
  description,
  companyId,
  userId,
  imageUrl,
  link
}: INotification): Promise<INotificationCreated> {
  try {
    const newNotification = await repository.create({
      title,
      description,
      companyId,
      userId,
      imageUrl,
      link
    })
    return newNotification
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar notificação',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getNotificationById(id: string): Promise<INotificationCreated> {
  try {
    const notification = await repository.getOneBy(id)

    return notification
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get notification',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getAllNotifications(
  filter: INotificationFilter
): Promise<INotificationCreated[]> {
  try {
    const allNotifications = await repository.getAll(filter)

    return allNotifications
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get notifications',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateNotification(
  id: string,
  { title, description, imageUrl, link }: INotificationModifier
): Promise<INotificationCreated> {
  const updatedNotification: INotificationCreated = await repository
    .update(id, { title, description, imageUrl, link })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar notificação',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  return updatedNotification
}

async function deleteNotification(id: string): Promise<void> {
  await repository.delete(id).catch((error: any) => {
    throw new CustomError(
      'Erro ao deletar notificação',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  })
}

export {
  createNotification,
  getNotificationById,
  getAllNotifications,
  updateNotification,
  deleteNotification
}
