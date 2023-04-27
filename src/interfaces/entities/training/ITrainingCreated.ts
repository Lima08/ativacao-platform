import { IMediaCreated } from '../media'
import type { ITraining } from './ITraining'

export interface ITrainingCreated extends ITraining {
  id: string
  active: boolean
  medias: IMediaCreated[]
  createdAt: Date
  updatedAt: Date
}
