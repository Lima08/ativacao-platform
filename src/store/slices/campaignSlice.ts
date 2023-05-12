import { StateCreator } from 'zustand'
import httpServices from 'services/http'
import {
  CreatePayloadStore,
  ICampaign,
  ICampaignStore
} from '../types/iCampaignStore'
import { ICampaignCreated } from 'interfaces/entities/campaign'

const createCampaignsSlice: StateCreator<ICampaignStore> = (set) => ({
  currentCampaign: null,
  campaignsList: [],
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
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
    set((state) => ({
      ...state,
      loading: false,
      error: response.error,
      campaignsList: [...state.campaignsList, response.data as ICampaignCreated]
    }))
  },
  updateCampaign: async (id: string, updatedCampaign: CreatePayloadStore) => {
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
  deleteCampaign: async (id: string) => {
    set({ loading: true })

    await httpServices.campaigns.delete(id)
    set((state) => ({
      ...state,
      loading: false,
      campaignsList: state.campaignsList.filter((c) => c.id !== id)
    }))
  }
})

export default createCampaignsSlice
