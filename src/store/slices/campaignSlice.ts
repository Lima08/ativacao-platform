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
  campaignsList: ICampaignCreated[] | null
  resetCampaignState: () => void
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
  campaignsList: null,
  resetCampaignState: () => {
    set(() => ({ campaignsList: null, currentCampaign: null }))
  },
  resetCurrentCampaign: () => set(() => ({ currentCampaign: null })),
  getCampaignById: async (id) => {
    if (!id) return

    useGlobalStore.getState().setError(null)
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.campaigns.getById(id)

      if (!response.data?.id) {
        useGlobalStore.getState().setToaster({
          isOpen: true,
          message: 'Campanha não encontrada!',
          type: 'warning'
        })
        return
      }

      set((state) => ({
        ...state,
        currentCampaign: response?.data
      }))
    } catch (error) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar campanha!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllCampaigns: async () => {
    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      const response = await httpServices.campaigns.getAll()
      set((state) => ({
        ...state,
        campaignsList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar campanhas',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createCampaign: async (newCampaign: CreatePayloadStore) => {
    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      const response = await httpServices.campaigns.create(newCampaign)
      set((state) => ({
        ...state,
        campaignsList: state.campaignsList
          ? [...state.campaignsList, response.data as ICampaignCreated]
          : [response.data as ICampaignCreated]
      }))

      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Campanha criada com sucesso!',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao criar campanha! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateCampaign: async (id, updatedCampaign) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const mediaIds: string[] = []
      if (updatedCampaign?.medias) {
        const ids = updatedCampaign.medias.map((media) => media.id)
        ids.forEach((id) => {
          mediaIds.push(id)
        })
      }
      if (updatedCampaign.mediaIds) {
        updatedCampaign.mediaIds.forEach((id) => {
          mediaIds.push(id)
        })
      }

      await httpServices.campaigns.update(id, { ...updatedCampaign, mediaIds })
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Campanha atualizada com sucesso!',
        type: 'success'
      })

      set((state) => ({
        ...state,
        campaignsList: null
      }))
    } catch (error) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          'Erro ao atualizar campanha! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    }
  },
  handleCampaignActive: async (id: string, active: boolean) => {
    set((state) => ({
      ...state,
      campaignsList:
        state.campaignsList &&
        state.campaignsList.map((campaign) =>
          campaign.id === id ? { ...campaign, active } : campaign
        )
    }))

    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

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
    try {
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        campaignsList:
          state.campaignsList && state.campaignsList.filter((c) => c.id !== id)
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
