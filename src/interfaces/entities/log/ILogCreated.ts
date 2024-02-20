import type { ILog } from './ILog'

export interface ILogCreated extends ILog {
  id: string
  createdAt: Date
  updatedAt: Date
}


