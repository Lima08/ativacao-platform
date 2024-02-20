import type { PrismaClient } from '@prisma/client'
import { ILog } from 'interfaces/entities/log/ILog'
import { ILogCreated } from 'interfaces/entities/log/ILogCreated'
import { ILogFilter } from 'interfaces/entities/log/ILogFilter'
import { ILogModifier } from 'interfaces/entities/log/ILogModifier'

export class Log {
  private repository: PrismaClient
  private static instance: Log

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Log {
    if (!this.instance) {
      this.instance = new Log(client)
    }
    return this.instance
  }

  async create(data: ILog): Promise<ILogCreated> {
    const newLog = await this.repository.log.create({
      data
    })
    return newLog
  }

  async getAll(filter: ILogFilter): Promise<ILogCreated[]> {
    const allLogs = await this.repository.log.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allLogs
  }

  async getOneBy(id: string): Promise<ILogCreated> {
    try {
      const foundedLog = await this.repository.log.findUnique({
        where: { id }
      })

      return foundedLog
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async findFirst({
    campaignId,
    module,
    trainingId,
    userId
  }: ILogFilter): Promise<ILogCreated> {
    try {
      const foundedLog = await this.repository.log.findFirst({
        where: {
          AND: [{ userId, trainingId, module, campaignId }]
        }
      })

      return foundedLog
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(id: string, modifier: ILogModifier): Promise<ILogCreated> {
    const updatedLog = await this.repository.log.update({
      where: { id },
      data: modifier
    })
    return updatedLog
  }

  async delete(id: string): Promise<void> {
    await this.repository.log.delete({
      where: { id }
    })
  }
}
