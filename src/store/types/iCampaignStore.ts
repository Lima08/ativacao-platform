export interface ICampaign {
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

export interface ICampaignStore {
  campaigns: ICampaign[]
  loading: boolean
  error: any
  createCampaign: (newCampaign: CreatePayloadStore) => Promise<void>
  getAllCampaigns: () => void
  deleteCampaign: (id: string) => Promise<void>
  updateCampaign: (
    id: string,
    updatedCampaign: CreatePayloadStore
  ) => Promise<void>
}
