import { IOrderCreated } from './IOrderCreated'

export type IOrderFilter = Partial<
  Pick<IOrderCreated, 'status' | 'templateOrderId' | 'companyId' | 'userId'>
>
