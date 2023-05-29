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
  mediasToExclude?: string[] | []
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
    const response = await httpClient.post('/api/trainings/create', {
      name,
      description,
      mediaIds
    })

    return response.data
  },

  getAll: async () => {
    const response = await httpClient.get('/api/trainings/getAll')

    return response.data
  },

  getById: async (trainingId) => {
    const response = await httpClient.get(`/api/trainings/${trainingId}`)

    return response.data
  },

  update: async (
    trainingId,
    { name, description, active, mediaIds, mediasToExclude }
  ) => {
    const response = await httpClient.put(`/api/trainings/${trainingId}`, {
      name,
      description,
      active,
      mediaIds,
      mediasToExclude
    })

    return response.data
  },

  delete: async (trainingId: string) => {
    await httpClient.delete(`/api/trainings/${trainingId}`)
  }
})

export default TrainingService
