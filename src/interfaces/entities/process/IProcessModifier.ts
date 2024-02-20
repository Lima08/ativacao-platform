import { eProcessStatus } from './EProcessStatus'

export interface IProcessModifier {
  title?: string
  message?: string
  status?: eProcessStatus
}
