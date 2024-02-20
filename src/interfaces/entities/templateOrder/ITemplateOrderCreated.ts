import type { ITemplateOrder } from './ITemplateOrder'

export interface ITemplateOrderCreated extends ITemplateOrder {
  id: string
  createdAt: Date
  updatedAt: Date
}
