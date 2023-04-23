import type { ITraining } from './ITraining'

export interface ITrainingCreated extends ITraining {
  id: string
  createdAt: Date
  updatedAt: Date
}
