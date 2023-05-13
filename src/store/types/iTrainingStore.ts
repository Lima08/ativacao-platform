import { ITrainingCreated } from 'interfaces/entities/training'
import { modifierTrainingDto } from 'useCases/trainings/dto'

export interface ITraining {
  id: string
  name: string
  description: string
  media: string[]
  createdAt: string
  updatedAt: string
}

export type CreatePayloadStore = {
  name: string
  description?: string
  mediaIds?: string[] | []
}

export interface ITrainingStore {
  currentTraining: ITrainingCreated | null
  trainingsList: ITrainingCreated[]
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  resetCurrentTraining: () => void
  createTraining: (newTraining: CreatePayloadStore) => void
  getTrainingById: (id: string) => void
  getAllTrainings: () => void
  deleteTraining: (id: string) => void
  updateTraining: (id: string, updatedTraining: modifierTrainingDto) => void
  handleTrainingActive: (id: string, status: boolean) => void
}
