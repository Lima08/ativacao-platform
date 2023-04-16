import { PrismaClient } from '@prisma/client'
import {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'

export class User {
  private repository: PrismaClient
  private static instance: User

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): User {
    if (!this.instance) {
      this.instance = new User(client)
    }
    return this.instance
  }

  async create(data: IUser): Promise<IUserCreated> {
    const newUser = await this.repository.user.create({
      data
    })
    return newUser
  }

  async getAll(filter?: IUserFilter | undefined): Promise<IUserCreated[]> {
    const allUsers = await this.repository.user.findMany({
      where: filter
    })

    return allUsers
  }

  async getOneBy(id: string): Promise<IUserCreated> {
    try {
      const foundedUser = await this.repository.user.findUnique({
        where: { id }
      })

      return foundedUser
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(id: string, modifier: IUserModifier): Promise<IUserCreated> {
    const updatedUser = await this.repository.user.update({
      where: { id },
      data: modifier
    })
    return updatedUser
  }

  async delete(id: string): Promise<void> {
    await this.repository.user.delete({
      where: { id }
    })
  }
}
