import { PrismaClient } from '@prisma/client'
import { IFile, IFileCreated, IFileFilter } from 'interfaces/entities/file'

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

  async create(data: IFile): Promise<IFileCreated> {
    const newMedia = await this.repository.Media.create({
      data
    })
    return newMedia
  }

  async getAll(filter: IFileFilter): Promise<IFileCreated[]> {
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
