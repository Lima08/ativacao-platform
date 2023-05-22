import { ICampaignCreated } from 'interfaces/entities/campaign'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { modifierCampaignDto } from 'useCases/campaigns/dto'
import { StateCreator } from 'zustand'

import { CreatePayloadStore, ICampaignStore } from '../types/iCampaignStore'

const createCampaignsSlice: StateCreator<ICampaignStore> = (set) => ({
  currentCampaign: null,
  campaignsList: [],
  resetCurrentCampaign: () => set(() => ({ currentCampaign: null })),
  getCampaignById: async (id) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.campaigns.getById(id)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    set((state) => ({
      ...state,
      currentCampaign: response?.data,
      error: response?.error
    }))
    useGlobalStore.getState().setLoading(false)
  },
  getAllCampaigns: async () => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.campaigns.getAll()
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response.data) {
      set((state) => ({
        ...state,
        campaignsList: response.data
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.campaigns.create(newCampaign)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        campaignsList: [
          ...state.campaignsList,
          response.data as ICampaignCreated
        ]
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  updateCampaign: async (id: string, updatedCampaign: modifierCampaignDto) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.campaigns.update(id, updatedCampaign)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        campaignsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  handleCampaignActive: async (id: string, status: boolean) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.campaigns.update(id, { active: status })
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        trainingsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  deleteCampaign: async (id: string) => {
    useGlobalStore.getState().setLoading(true)

    set((state) => ({
      ...state,
      campaignsList: state.campaignsList.filter((c) => c.id !== id)
    }))

    await httpServices.campaigns.delete(id)
    useGlobalStore.getState().setLoading(false)
  }
})

export default createCampaignsSlice
