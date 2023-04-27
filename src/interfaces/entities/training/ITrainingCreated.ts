import type { ITraining } from './ITraining'

export interface ITrainingCreated extends ITraining {
  id: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}
