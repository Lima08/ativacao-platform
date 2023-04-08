import { PrismaClient } from '@prisma/client'
import {
  IUser,
  IUserCreated,
  IUserFilter,
  IUserModifier
} from 'interfaces/entities/user'

export class User {
  private repository: PrismaClient
  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): User {
    return new User(client)
  }

  async create(data: IUser): Promise<IUserCreated> {
    const newUser = await this.repository.user.create({
      data
    })
    return newUser
  }

  async getAll(filter?: IUserFilter | undefined): Promise<IUserCreated[]> {
    const allUsers = await this.repository.user.findMany(filter)

    return allUsers
  }

  async getOneBy(filter: IUserFilter): Promise<IUserCreated> {
    try {
      const foundedUser = await this.repository.user.findUnique({
        where: { ...filter }
      })

      return foundedUser
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(id: string, modifier: IUserModifier): Promise<IUserCreated> {
    const updatedUser = await this.repository.user.update({
      where: { id },
      data: { ...modifier }
    })
    return updatedUser
  }

  async delete(id: string): Promise<void> {
    await this.repository.user.delete({
      where: { id }
    })
  }
}
