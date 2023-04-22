import { PrismaClient } from '@prisma/client'
import { IMedia, IMediaCreated, IMediaFilter } from 'interfaces/entities/media'

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
    const newMedia = await this.repository.Media.create({
      data
    })
    return newMedia
  }

  async getAll(filter: IMediaFilter): Promise<IMediaCreated[]> {
    const allMedias = await this.repository.Media.findMany({
      where: filter
    })

    return allMedias
  }

  async delete(id: string): Promise<void> {
    await this.repository.Media.delete({
      where: { id }
    })
  }
}
