import type { PrismaClient } from '@prisma/client'
import {
  IProcess,
  IProcessCreated,
  IProcessFilter,
  IProcessModifier
} from 'interfaces/entities/process'

export class Process {
  private repository: PrismaClient
  private static instance: Process

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Process {
    if (!this.instance) {
      this.instance = new Process(client)
    }
    return this.instance
  }

  async create(data: IProcess): Promise<IProcessCreated> {
    const newProcess = await this.repository.process.create({
      data
    })
    return newProcess
  }

  async get(id: string): Promise<IProcessCreated> {
    const allProcesses = await this.repository.process.findUnique({
      where: { id }
    })

    return allProcesses
  }

  async getAll(filter: IProcessFilter): Promise<IProcessCreated[]> {
    const allProcess = await this.repository.process.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allProcess
  }

  async update(
    id: string,
    modifier: IProcessModifier
  ): Promise<IProcessCreated> {
    const updatedProcess = await this.repository.process.update({
      where: { id },
      data: modifier
    })
    return updatedProcess
  }

  async delete(id: string): Promise<void> {
    await this.repository.process.delete({
      where: { id }
    })
  }
}
