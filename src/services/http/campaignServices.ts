import { AxiosInstance } from 'axios'
import { ApiResponse } from '../../../types'

type Campaign = {
  id: string
  name: string
  description: string
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
  mediaIds?: string[] | []
}

export interface CampaignServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<Campaign>>
  getById(campaignId: string): Promise<ApiResponse<Campaign>>
  getAll(): Promise<ApiResponse<Campaign[]>>
  update(
    campaignId: string,
    payload: ModifierPayload
  ): Promise<ApiResponse<Campaign>>
  delete(campaignId: string): Promise<void>
}

const CampaignService = (
  httpClient: AxiosInstance
): CampaignServiceInterface => ({
  create: async ({ name, description, mediaIds }) => {
    const response = await httpClient.post('/api/campaigns/create', {
      name,
      description,
      mediaIds
    })

    return response.data
  },

  getAll: async () => {
    const response = await httpClient.get('/api/campaigns')

    return response.data
  },

  getById: async (campaignId) => {
    const response = await httpClient.get('/api/campaigns', {
      params: { campaignId }
    })

    return response.data
  },

  update: async (campaignId, { name, description, mediaIds }) => {
    const response = await httpClient.put(`/api/campaigns/${campaignId}`, {
      name,
      description,
      mediaIds
    })

    return response.data
  },

  delete: async (campaignId: string) => {
    const response = await httpClient.delete(`/api/campaigns/${campaignId}`)
    return response.data
  }
})

export default CampaignService
