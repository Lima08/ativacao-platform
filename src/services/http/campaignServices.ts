import { AxiosInstance } from 'axios'

type Campaign = {
  name: string
  description: string
  media: string[]
}

type Error = {
  message: string
  meta: Record<string, any>
}

type Create = {
  data?: Campaign
  error?: Error | null
}

type CreatePayload = {
  name: string
  description?: string
  mediaIds?: string[] | []
}

export interface CampaignServiceInterface {
  create(payload: CreatePayload): Promise<Create>
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
  }
})

export default CampaignService
