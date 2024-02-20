import { eProcessStatus } from './EProcessStatus'
import type { IProcess } from './IProcess'

export interface IProcessCreated extends IProcess {
  id: string
  status: eProcessStatus
  message?: string
  createdAt: Date
  updatedAt: Date
}
