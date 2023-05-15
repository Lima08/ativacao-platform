import { AxiosInstance } from 'axios'
import { ApiResponse } from '../../../types'
import { ICampaignCreated } from 'interfaces/entities/campaign'

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
    try {
      const response = await httpClient.post('/api/campaigns/create', {
        name,
        description,
        mediaIds
      })
      return response.data
    } catch (error) {
      console.error('Error to create campaign:', error)
      return error
    }
  },

  getAll: async () => {
    try {
      const response = await httpClient.get('/api/campaigns/getAll')
      return response.data || []
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return error
    }
  },
  getById: async (campaignId) => {
    try {
      const response = await httpClient.get(`/api/campaigns/${campaignId}`)
      return response.data
    } catch (error) {
      console.error('Error to get campaign:', error)
      return error
    }
  },

  update: async (campaignId, { name, description, active, mediaIds }) => {
    try {
      const response = await httpClient.put(`/api/campaigns/${campaignId}`, {
        name,
        description,
        active,
        mediaIds
      })

      return response.data
    } catch (error) {
      console.error('Error to update campaign:', error)
      return error
    }
  },

  delete: async (campaignId: string) => {
    try {
      await httpClient.delete(`/api/campaigns/${campaignId}`)
    } catch (error) {
      console.error('Error to delete campaign:', error)
      // TODO: Tratar erro criando handler global
    }
  }
})

export default CampaignService
