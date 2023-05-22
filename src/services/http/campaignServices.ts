import { AxiosInstance } from 'axios'
import { ICampaignCreated } from 'interfaces/entities/campaign'

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

export interface CampaignServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<ICampaignCreated>>
  getById(campaignId: string): Promise<ApiResponse<ICampaignCreated>>
  getAll(): Promise<ApiResponse<ICampaignCreated[]>>
  update(
    campaignId: string,
    payload: ModifierPayload
  ): Promise<ApiResponse<ICampaignCreated>>
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
    const response = await httpClient.get('/api/campaigns/getAll')

    return response.data
  },
  getById: async (campaignId) => {
    const response = await httpClient.get(`/api/campaigns/${campaignId}`)
    return response.data
  },

  update: async (campaignId, { name, description, active, mediaIds }) => {
    const response = await httpClient.put(`/api/campaigns/${campaignId}`, {
      name,
      description,
      active,
      mediaIds
    })

    return response.data
  },

  delete: async (campaignId: string) => {
    await httpClient.delete(`/api/campaigns/${campaignId}`)
  }
})

export default CampaignService
