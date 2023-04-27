import { AxiosInstance } from 'axios'
import { ApiResponse } from '../../../types'

type Training = {
  id: string
  name: string
  description: string
  active: boolean
  media: string[]
  createdAt: string
  updatedAt: string
}

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
  create(payload: CreatePayload): Promise<ApiResponse<Training>>
  getById(trainingId: string): Promise<ApiResponse<Training>>
  getAll(): Promise<ApiResponse<Training[]>>
  update(
    trainingId: string,
    payload: ModifierPayload
  ): Promise<ApiResponse<Training>>
  delete(trainingId: string): Promise<void>
  toggleActive(trainingId: string): Promise<Training>
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
    const response = await httpClient.get('/api/trainings')

    return response.data
  },

  getById: async (trainingId) => {
    const response = await httpClient.get('/api/trainings', {
      params: { trainingId }
    })

    return response.data
  },

  update: async (trainingId, { name, description, active, mediaIds }) => {
    const response = await httpClient.put(`/api/trainings/${trainingId}`, {
      name,
      description,
      active,
      mediaIds
    })

    return response.data
  },

  delete: async (trainingId: string) => {
    const response = await httpClient.delete(`/api/trainings/${trainingId}`)
    return response.data
  },

  toggleActive: async (trainingId: string) => {
    const response = await httpClient.put(
      `/api/trainings/${trainingId}/toggleActive`
    )
    return response.data
  }
})

export default TrainingService
