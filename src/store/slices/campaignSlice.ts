import { ICampaignCreated } from 'interfaces/entities/campaign'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { modifierCampaignDto } from 'useCases/campaigns/dto'
import { StateCreator } from 'zustand'

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
  currentCampaign: ICampaignCreated | null
  campaignsList: ICampaignCreated[]
  resetCurrentCampaign: () => void
  createCampaign: (newCampaign: CreatePayloadStore) => void
  getCampaignById: (id: string) => void
  getAllCampaigns: () => void
  deleteCampaign: (id: string) => void
  updateCampaign: (id: string, updatedCampaign: modifierCampaignDto) => void
  handleCampaignActive: (id: string, status: boolean) => void
}

const createCampaignsSlice: StateCreator<ICampaignStore> = (set) => ({
  currentCampaign: null,
  campaignsList: [],
  resetCurrentCampaign: () => set(() => ({ currentCampaign: null })),
  getCampaignById: async (id) => {
    try {
      const response = await httpServices.campaigns.getById(id)
      set((state) => ({
        ...state,
        currentCampaign: response?.data,
        error: response?.error
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllCampaigns: async () => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.campaigns.getAll()
      set((state) => ({
        ...state,
        campaignsList: response.data
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.campaigns.create(newCampaign)
      set((state) => ({
        ...state,
        campaignsList: [
          ...state.campaignsList,
          response.data as ICampaignCreated
        ]
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateCampaign: async (id: string, updatedCampaign: modifierCampaignDto) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      campaignList: state.campaignsList.map((campaign) => {
        if (campaign.id !== id) return campaign

        const { mediasToExclude } = updatedCampaign
        if (!mediasToExclude?.length) return { ...campaign, ...updatedCampaign}

        const updatedMedias = campaign.medias.filter(
          (media) => !mediasToExclude.includes(media.id)
        )
        return { ...campaign, ...updatedCampaign, medias: updatedMedias }
      })
    }))
    try {
      await httpServices.campaigns.update(id, updatedCampaign)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  handleCampaignActive: async (id: string, active: boolean) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      campaignsList: state.campaignsList.map((campaign) =>
        campaign.id === id ? { ...campaign, active } : campaign
      )
    }))
    try {
      await httpServices.campaigns.update(id, {
        active
      })
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteCampaign: async (id: string) => {
    useGlobalStore.getState().setLoading(true)

    try {
      set((state) => ({
        ...state,
        campaignsList: state.campaignsList.filter((c) => c.id !== id)
      }))

      await httpServices.campaigns.delete(id)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createCampaignsSlice
