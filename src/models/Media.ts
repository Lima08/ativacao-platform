import type { PrismaClient } from '@prisma/client'
import {
  IMedia,
  IMediaCreated,
  IMediaFilter,
  IMediaModifier
} from 'interfaces/entities/media'

export class Media {
  private repository: PrismaClient
  private static instance: Media

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Media {
    if (!this.instance) {
      this.instance = new Media(client)
    }
    return this.instance
  }

  async create(data: IMedia): Promise<IMediaCreated> {
    const newMedia = await this.repository.media.create({
      data
    })
    return newMedia
  }

  async get(id: string): Promise<IMediaCreated> {
    const allMedias = await this.repository.media.findUnique({ where: { id } })

    return allMedias
  }

  async getAll(filter: IMediaFilter): Promise<IMediaCreated[]> {
    const allMedias = await this.repository.media.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allMedias
  }

  async update(id: string, modifier: IMediaModifier): Promise<IMediaCreated> {
    const updatedMedia = await this.repository.media.update({
      where: { id },
      data: modifier
    })
    return updatedMedia
  }

  async delete(id: string): Promise<void> {
    await this.repository.media.delete({
      where: { id }
    })
  }
}
