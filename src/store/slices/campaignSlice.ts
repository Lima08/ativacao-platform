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

    try {
      const response = await httpServices.campaigns.update(id, updatedCampaign)
      set((state) => ({
        ...state,
        campaignsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  handleCampaignActive: async (id: string, status: boolean) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.campaigns.update(id, {
        active: status
      })
      set((state) => ({
        ...state,
        trainingsList: state.campaignsList.map((c) =>
          c.id === id ? (response.data as ICampaignCreated) : c
        )
      }))
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
