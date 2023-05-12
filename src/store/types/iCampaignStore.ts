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
  currentCampaign: ICampaign | null
  campaignsList: ICampaign[]
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  createCampaign: (newCampaign: CreatePayloadStore) => void
  getCampaignById: (id: string) => void
  getAllCampaigns: () => void
  deleteCampaign: (id: string) => void
  updateCampaign: (id: string, updatedCampaign: CreatePayloadStore) => void
}
