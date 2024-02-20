import type { PrismaClient } from '@prisma/client'
import {
  IOrder,
  IOrderCreated,
  IOrderFilter,
  IOrderModifier
} from 'interfaces/entities/Order'

export class Order {
  private repository: PrismaClient
  private static instance: Order

  constructor(connect: PrismaClient) {
    this.repository = connect
  }

  static of(client: PrismaClient): Order {
    if (!this.instance) {
      this.instance = new Order(client)
    }
    return this.instance
  }

  async create(data: IOrder): Promise<IOrderCreated> {
    const newOrder = await this.repository.Order.create({
      data
    })
    return newOrder
  }

  async get(id: string): Promise<IOrderCreated> {
    const allOrders = await this.repository.Order.findUnique({
      where: { id }
    })

    return allOrders
  }

  async getAll(filter: IOrderFilter): Promise<IOrderCreated[]> {
    const allOrder = await this.repository.Order.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return allOrder
  }

  async update(
    id: string,
    modifier: IOrderModifier
  ): Promise<IOrderCreated> {
    const updatedOrder = await this.repository.Order.update({
      where: { id },
      data: modifier
    })
    return updatedOrder
  }

  async delete(id: string): Promise<void> {
    await this.repository.Order.delete({
      where: { id }
    })
  }
}
