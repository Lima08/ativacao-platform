import { AxiosInstance } from 'axios'
import { ApiResponse } from '../../../types'
import { ITrainingCreated } from 'interfaces/entities/training'

type CreatePayload = {
  name: string
  description?: string
  mediaIds?: string[] | []
}

type ModifierPayload = {
  name?: string
  description?: string
  active?: boolean
  mediaIds?: string[] | []
}

export interface TrainingServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<ITrainingCreated>>
  getById(trainingId: string): Promise<ApiResponse<ITrainingCreated>>
  getAll(): Promise<ApiResponse<ITrainingCreated[]>>
  update(
    trainingId: string,
    payload: ModifierPayload
  ): Promise<ApiResponse<ITrainingCreated>>
  delete(trainingId: string): Promise<void>
}

const TrainingService = (
  httpClient: AxiosInstance
): TrainingServiceInterface => ({
  create: async ({ name, description, mediaIds }) => {
    try {
      const response = await httpClient.post('/api/trainings/create', {
        name,
        description,
        mediaIds
      })

      return response.data
    } catch (error) {
      console.error('Error to create training:', error)
      return error
    }
  },

  getAll: async () => {
    try {
      const response = await httpClient.get('/api/trainings/getAll')

      return response.data
    } catch (error) {
      console.error('Error fetching trainings:', error)
      return error
    }
  },

  getById: async (trainingId) => {
    try {
      const response = await httpClient.get(`/api/trainings/${trainingId}`)

      return response.data
    } catch (error) {
      console.error('Error to get training:', error)
      return error
    }
  },

  update: async (trainingId, { name, description, active, mediaIds }) => {
    try {
      const response = await httpClient.put(`/api/trainings/${trainingId}`, {
        name,
        description,
        active,
        mediaIds
      })

      return response.data
    } catch (error) {
      console.error('Error to update training:', error)
      return error
    }
  },

  delete: async (trainingId: string) => {
    try {
      const response = await httpClient.delete(`/api/trainings/${trainingId}`)
      return response.data
    } catch (error) {
      console.error('Error to delete training:', error)
    }
  }
})

export default TrainingService
