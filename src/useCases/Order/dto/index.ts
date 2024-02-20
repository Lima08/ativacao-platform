import { IDocumentCreated } from 'interfaces/entities/document'
import { IOrder, IOrderCreated } from 'interfaces/entities/Order'

export interface newOrderDto extends IOrder {
  documentIds: string[]
}

export interface createdOrderDto extends IOrderCreated {
  documents: IDocumentCreated[]
}
