import { eOrderStatus } from './EOrderStatus'

export interface IOrderModifier {
  title?: string
  message?: string
  status?: eOrderStatus
}
