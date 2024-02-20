import { IDocumentCreated } from '../document'
import { eOrderStatus } from './EOrderStatus'
import type { IOrder } from './IOrder'

export interface IOrderCreated extends IOrder {
  id: string
  status: eOrderStatus
  documents: IDocumentCreated[]
  message?: string
  createdAt: Date
  updatedAt: Date
}
