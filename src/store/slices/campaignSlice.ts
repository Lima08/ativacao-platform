import { StateCreator } from 'zustand'
import httpServices from 'services/http'
import { CreatePayloadStore, ICampaignStore } from '../types/iCampaignStore'
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
      currentCampaign: response?.data,
      error: response?.error
    }))
  },
  getAllCampaigns: async () => {
    set({ loading: true })

    const response = await httpServices.campaigns.getAll()
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
    }
    if (response.data) {
      set((state) => ({
        ...state,
        loading: false,
        campaignsList: response.data
      }))
    }
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    set({ loading: true })

    const response = await httpServices.campaigns.create(newCampaign)
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
      return
    }
    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        campaignsList: [
          ...state.campaignsList,
          response.data as ICampaignCreated
        ]
      }))
    }
  },
  updateCampaign: async (id: string, updatedCampaign: modifierCampaignDto) => {
    set({ loading: true })

    const response = await httpServices.campaigns.update(id, updatedCampaign)
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        campaignsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
    }
  },
  handleCampaignActive: async (id: string, status: boolean) => {
    set({ loading: true })

    const response = await httpServices.campaigns.update(id, { active: status })
    if (response && response.error) {
      set((state) => ({
        ...state,
        loading: false,
        error: response.error
      }))
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        trainingsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
    }
  },
  deleteCampaign: async (id: string) => {
    set((state) => ({
      ...state,
      campaignsList: state.campaignsList.filter((c) => c.id !== id)
    }))

    await httpServices.campaigns.delete(id)
  }
})

export default createCampaignsSlice
