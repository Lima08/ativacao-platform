import { StateCreator } from 'zustand'
import httpServices from 'services/http'
import {
  CreatePayloadStore,
  ICampaign,
  ICampaignStore
} from '../types/iCampaignStore'
import { ICampaignCreated } from 'interfaces/entities/campaign'
import { modifierCampaignDto } from 'useCases/campaigns/dto'

const createCampaignsSlice: StateCreator<ICampaignStore> = (set) => ({
  currentCampaign: null,
  campaignsList: [],
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  resetCurrentCampaign: () => set(() => ({ currentCampaign: null })),
  getCampaignById: async (id) => {
    set({ loading: true })

    const response = await httpServices.campaigns.getById(id)
    set((state) => ({
      ...state,
      loading: false,
      currentCampaign: response.data,
      error: response.error
    }))
  },
  getAllCampaigns: async () => {
    set({ loading: true })
    
    const response = await httpServices.campaigns.getAll()
    set((state) => ({
      ...state,
      loading: false,
      campaignsList: response.data,
      error: response.error
    }))
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    set({ loading: true })

    const response = await httpServices.campaigns.create(newCampaign)

    if (response.error || !response.data) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
      return
    }
    set((state) => ({
      ...state,
      loading: false,
      campaignsList: [...state.campaignsList, response.data as ICampaignCreated]
    }))
  },
  updateCampaign: async (id: string, updatedCampaign: modifierCampaignDto) => {
    set({ loading: true })

    const response = await httpServices.campaigns.update(id, updatedCampaign)
    set((state) => ({
      ...state,
      loading: false,
      error: response.error,
      campaignsList: state.campaignsList.map((c) =>
        c.id === id ? (response.data as ICampaignCreated) : c
      )
    }))
  },
  handleCampaignActive: async (id: string, status: boolean) => {
    set({ loading: true })

    const response = await httpServices.trainings.update(id, { active: status })
    set((state) => ({
      ...state,
      loading: false,
      error: response.error,
      trainingsList: state.campaignsList.map((c) =>
        c.id === id ? (response.data as ICampaignCreated) : c
      )
    }))
  },
  deleteCampaign: async (id: string) => {
    set({ loading: true })
    set((state) => ({
      ...state,
      campaignsList: state.campaignsList.filter((c) => c.id !== id)
    }))

    await httpServices.campaigns.delete(id)
    set({ loading: false })
  }
})

export default createCampaignsSlice
