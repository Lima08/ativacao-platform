import type { PrismaClient } from '@prisma/client'
import {
  INotification,
  INotificationCreated,
  INotificationFilter,
  INotificationModifier
} from 'interfaces/entities/notification'

export class Notification {
  private repository: PrismaClient
  private static instance: Notification

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Notification {
    if (!this.instance) {
      this.instance = new Notification(client)
    }
    return this.instance
  }

  async create(data: INotification): Promise<INotificationCreated> {
    const newNotification = await this.repository.Notification.create({
      data
    })
    return newNotification
  }

  async getAll(filter: INotificationFilter): Promise<INotificationCreated[]> {
    const allNotifications = await this.repository.Notification.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allNotifications
  }

  async getOneBy(id: string): Promise<INotificationCreated> {
    try {
      const foundedNotification = await this.repository.Notification.findUnique(
        {
          where: { id }
        }
      )

      return foundedNotification
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: INotificationModifier
  ): Promise<INotificationCreated> {
    const updatedNotification = await this.repository.Notification.update({
      where: { id },
      data: modifier
    })
    return updatedNotification
  }

  async delete(id: string): Promise<void> {
    await this.repository.Notification.delete({
      where: { id }
    })
  }
}
