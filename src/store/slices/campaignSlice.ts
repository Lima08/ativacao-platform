import { StateCreator } from 'zustand'
import httpServices from 'services/http'
import {
  CreatePayloadStore,
  ICampaign,
  ICampaignStore
} from '../types/iCampaignStore'

const createCampaignsSlice: StateCreator<ICampaignStore> = (set) => ({
  campaigns: [],
  loading: false,
  error: null,
  getAllCampaigns: async () => {
    set({ loading: true })
    try {
      const { data } = await httpServices.campaigns.getAll()
      set({ campaigns: data, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    try {
      set({ loading: true })
      const response = await httpServices.campaigns.create(newCampaign)
      if (response.data) {
        set((state) => ({
          ...state,
          campaigns: [...state.campaigns, response.data as ICampaign]
        }))
      }
    } catch (error) {
      set({ error })
    } finally {
      set({ loading: false })
    }
  },
  updateCampaign: async (id: string, updatedCampaign: CreatePayloadStore) => {
    try {
      set({ loading: true })
      const response = await httpServices.campaigns.update(id, updatedCampaign)
      if (response.data) {
        set((state) => ({
          ...state,
          campaigns: state.campaigns.map((c) =>
            c.id === id ? (response.data as ICampaign) : c
          )
        }))
      }
    } catch (error) {
      set({ error })
    } finally {
      set({ loading: false })
    }
  },
  deleteCampaign: async (id: string) => {
    try {
      set({ loading: true })
      await httpServices.campaigns.delete(id)
      set((state) => ({
        ...state,
        campaigns: state.campaigns.filter((c) => c.id !== id)
      }))
    } catch (error) {
      set({ error })
    } finally {
      set({ loading: false })
    }
  }
})

export default createCampaignsSlice
