import { AxiosInstance } from 'axios'
import { ITrainingCreated } from 'interfaces/entities/training'

import { ApiResponse } from '../../../types'

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

      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },

  getAll: async () => {
    try {
      const response = await httpClient.get('/api/trainings/getAll')

      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },

  getById: async (trainingId) => {
    try {
      const response = await httpClient.get(`/api/trainings/${trainingId}`)

      return response
    } catch (error: any) {
      throw new Error(error.message)
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

      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },

  delete: async (trainingId: string) => {
    await httpClient.delete(`/api/trainings/${trainingId}`)
  }
})

export default TrainingService
