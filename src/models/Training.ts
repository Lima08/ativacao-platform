import type { PrismaClient } from '@prisma/client'
import {
  ITraining,
  ITrainingCreated,
  ITrainingFilter,
  ITrainingModifier
} from 'interfaces/entities/training'

export class Training {
  private repository: PrismaClient
  private static instance: Training

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Training {
    if (!this.instance) {
      this.instance = new Training(client)
    }
    return this.instance
  }

  async create(data: ITraining): Promise<ITrainingCreated> {
    const newTraining = await this.repository.training.create({
      data
    })
    return newTraining
  }

  async getAll(filter: ITrainingFilter): Promise<ITrainingCreated[]> {
    const allTrainings = await this.repository.training.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allTrainings
  }

  async getOneBy(id: string): Promise<ITrainingCreated> {
    try {
      const foundedTraining = await this.repository.training.findUnique({
        where: { id }
      })

      return foundedTraining
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: ITrainingModifier
  ): Promise<ITrainingCreated> {
    const updatedTraining = await this.repository.training.update({
      where: { id },
      data: modifier
    })
    return updatedTraining
  }

  async delete(id: string): Promise<void> {
    await this.repository.training.delete({
      where: { id }
    })
  }
}
