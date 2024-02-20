import type { PrismaClient } from '@prisma/client'
import {
  ICatalog,
  ICatalogCreated,
  ICatalogFilter,
  ICatalogModifier
} from 'interfaces/entities/catalog'

export class Catalog {
  private repository: PrismaClient
  private static instance: Catalog

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Catalog {
    if (!this.instance) {
      this.instance = new Catalog(client)
    }
    return this.instance
  }

  async create(data: ICatalog): Promise<ICatalogCreated> {
    const newCatalog = await this.repository.catalog.create({
      data
    })
    return newCatalog
  }

  async getAll(filter: ICatalogFilter): Promise<ICatalogCreated[]> {
    const allCatalogs = await this.repository.catalog.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allCatalogs
  }

  async getOneBy(id: string): Promise<ICatalogCreated> {
    try {
      const foundedCatalog = await this.repository.catalog.findUnique({
        where: { id }
      })

      return foundedCatalog
    } catch (error) {
      throw new Error(error as unknown as string)
    }
  }

  async update(
    id: string,
    modifier: ICatalogModifier
  ): Promise<ICatalogCreated> {
    const updatedCatalog = await this.repository.catalog.update({
      where: { id },
      data: modifier
    })
    return updatedCatalog
  }

  async delete(id: string): Promise<void> {
    await this.repository.catalog.delete({
      where: { id }
    })
  }
}
