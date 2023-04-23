import { PrismaClient } from '@prisma/client'
import {
  IUserTraining,
  IUserTrainingCreated,
  IUserTrainingFilter,
  IUserTrainingModifier
} from 'interfaces/entities/userTraining'

export class UserTraining {
  private repository: PrismaClient
  private static instance: UserTraining

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): UserTraining {
    if (!this.instance) {
      this.instance = new UserTraining(client)
    }
    return this.instance
  }

  async start(data: IUserTraining): Promise<IUserTrainingCreated> {
    const newTraining = await this.repository.userTraining.create({
      data
    })
    return newTraining
  }

  async getAll(filter: IUserTrainingFilter): Promise<IUserTrainingCreated[]> {
    const allTrainings = await this.repository.userTraining.findMany({
      where: filter
    })

    return allTrainings
  }

  async getOneBy(id: string): Promise<IUserTrainingCreated> {
    const foundedTraining = await this.repository.userTraining.findUnique({
      where: { id }
    })

    return foundedTraining
  }

  async update(
    id: string,
    modifier: IUserTrainingModifier
  ): Promise<IUserTrainingCreated> {
    const updatedTraining = await this.repository.userTraining.update({
      where: { id },
      data: modifier
    })
    return updatedTraining
  }

  async delete(id: string): Promise<void> {
    await this.repository.userTraining.delete({
      where: { id }
    })
  }
}
