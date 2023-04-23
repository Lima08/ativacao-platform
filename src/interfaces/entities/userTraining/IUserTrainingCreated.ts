import type { IUserTraining } from './IUserTraining'

export interface IUserTrainingCreated extends IUserTraining {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
}
