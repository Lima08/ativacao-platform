import type { PrismaClient } from '@prisma/client'
import {
  IDocument,
  IDocumentCreated,
  IDocumentFilter,
  IDocumentModifier
} from 'interfaces/entities/document'

export class Document {
  private repository: PrismaClient
  private static instance: Document

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Document {
    if (!this.instance) {
      this.instance = new Document(client)
    }
    return this.instance
  }

  async create(data: IDocument): Promise<IDocumentCreated> {
    const newDocument = await this.repository.document.create({
      data
    })
    return newDocument
  }

  async update(
    id: string,
    modifier: IDocumentModifier
  ): Promise<IDocumentCreated> {
    const updatedDocument = await this.repository.document.update({
      where: { id },
      data: modifier
    })
    return updatedDocument
  }

  async get(id: string): Promise<IDocumentCreated> {
    const allDocuments = await this.repository.document.findUnique({
      where: { id }
    })

    return allDocuments
  }

  async getAll(filter: IDocumentFilter): Promise<IDocumentCreated[]> {
    const allDocuments = await this.repository.document.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allDocuments
  }

  async delete(id: string): Promise<void> {
    await this.repository.document.delete({
      where: { id }
    })
  }
}
