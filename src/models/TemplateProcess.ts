import type { PrismaClient } from '@prisma/client'
import {
  ITemplateProcess,
  ITemplateProcessCreated,
  ITemplateProcessFilter,
  ITemplateProcessModifier
} from 'interfaces/entities/templateProcess'

export class TemplateProcess {
  private repository: PrismaClient
  private static instance: TemplateProcess

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): TemplateProcess {
    if (!this.instance) {
      this.instance = new TemplateProcess(client)
    }
    return this.instance
  }

  async create(data: ITemplateProcess): Promise<ITemplateProcessCreated> {
    const newTemplateProcess = await this.repository.templateProcess.create({
      data
    })
    return newTemplateProcess
  }

  async get(id: string): Promise<ITemplateProcessCreated> {
    const allTemplateProcesses =
      await this.repository.templateProcess.findUnique({
        where: { id }
      })

    return allTemplateProcesses
  }

  async getAll(
    filter: ITemplateProcessFilter
  ): Promise<ITemplateProcessCreated[]> {
    const allProcess = await this.repository.templateProcess.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allProcess
  }

  async update(
    id: string,
    modifier: ITemplateProcessModifier
  ): Promise<ITemplateProcessCreated> {
    const updatedTemplateProcess = await this.repository.templateProcess.update(
      {
        where: { id },
        data: modifier
      }
    )
    return updatedTemplateProcess
  }

  async delete(id: string): Promise<void> {
    await this.repository.templateProcess.delete({
      where: { id }
    })
  }
}
