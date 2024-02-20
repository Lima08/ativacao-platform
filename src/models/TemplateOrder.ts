import type { PrismaClient } from '@prisma/client'
import {
  ITemplateOrder,
  ITemplateOrderCreated,
  ITemplateOrderFilter,
  ITemplateOrderModifier
} from 'interfaces/entities/templateOrder'

export class TemplateOrder {
  private repository: PrismaClient
  private static instance: TemplateOrder

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): TemplateOrder {
    if (!this.instance) {
      this.instance = new TemplateOrder(client)
    }
    return this.instance
  }

  async create(data: ITemplateOrder): Promise<ITemplateOrderCreated> {
    const newTemplateOrder = await this.repository.templateOrder.create({
      data
    })
    return newTemplateOrder
  }

  async get(id: string): Promise<ITemplateOrderCreated> {
    const allTemplateOrder = await this.repository.templateOrder.findUnique({
      where: { id }
    })

    return allTemplateOrder
  }

  async getAll(filter: ITemplateOrderFilter): Promise<ITemplateOrderCreated[]> {
    const allTemplateOrder = await this.repository.templateOrder.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allTemplateOrder
  }

  async update(
    id: string,
    modifier: ITemplateOrderModifier
  ): Promise<ITemplateOrderCreated> {
    const updatedTemplateOrder = await this.repository.templateOrder.update({
      where: { id },
      data: modifier
    })
    return updatedTemplateOrder
  }

  async delete(id: string): Promise<void> {
    await this.repository.templateOrder.delete({
      where: { id }
    })
  }
}
