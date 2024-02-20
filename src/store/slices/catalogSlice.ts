import { ICatalogCreated } from 'interfaces/entities/catalog'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { modifierCatalogDto } from 'useCases/catalog/dto'
import { StateCreator } from 'zustand'

export interface ICatalog {
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
  documentIds?: string[] | []
}

export interface ICatalogStore {
  currentCatalog: ICatalogCreated | null
  catalogsList: ICatalogCreated[] | null
  resetCatalogState: () => void
  resetCurrentCatalog: () => void
  createCatalog: (newCatalog: CreatePayloadStore) => void
  getCatalogById: (id: string) => void
  getAllCatalogs: () => void
  deleteCatalog: (id: string) => void
  updateCatalog: (id: string, updatedCatalog: modifierCatalogDto) => void
  handleCatalogActive: (id: string, status: boolean) => void
}

const createCatalogsSlice: StateCreator<ICatalogStore> = (set) => ({
  currentCatalog: null,
  catalogsList: null,
  resetCatalogState: () => {
    set(() => ({ catalogsList: null, currentCatalog: null }))
  },
  resetCurrentCatalog: () => set(() => ({ currentCatalog: null })),
  getCatalogById: async (id) => {
    if (!id) return

    useGlobalStore.getState().setError(null)
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.catalog.getById(id)

      if (!response.data?.id) {
        useGlobalStore.getState().setToaster({
          isOpen: true,
          message: 'Catálogo não encontrado!',
          type: 'warning'
        })
        return
      }

      set((state) => ({
        ...state,
        currentCatalog: response?.data
      }))
    } catch (error) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar catálogo!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllCatalogs: async () => {
    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      const response = await httpServices.catalog.getAll()
      set((state) => ({
        ...state,
        catalogsList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar catálogos',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createCatalog: async (newCatalog: CreatePayloadStore) => {
    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      const response = await httpServices.catalog.create(newCatalog)
      set((state) => ({
        ...state,
        catalogsList: state.catalogsList
          ? [...state.catalogsList, response.data as ICatalogCreated]
          : [response.data as ICatalogCreated]
      }))

      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Catálogo criado com sucesso!',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao criar catálogo! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateCatalog: async (id, updatedCatalog) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const mediaIds: string[] = []
      if (updatedCatalog?.medias) {
        const ids = updatedCatalog.medias.map((media) => media.id)
        ids.forEach((id) => {
          mediaIds.push(id)
        })
      }
      if (updatedCatalog.mediaIds) {
        updatedCatalog.mediaIds.forEach((id) => {
          mediaIds.push(id)
        })
      }

      const documentIds: string[] = []
      if (updatedCatalog?.documents) {
        const ids = updatedCatalog.documents.map((document) => document.id)
        ids.forEach((id) => {
          documentIds.push(id)
        })
      }
      if (updatedCatalog.documentIds) {
        updatedCatalog.documentIds.forEach((id) => {
          documentIds.push(id)
        })
      }

      await httpServices.catalog.update(id, {
        ...updatedCatalog,
        mediaIds,
        documentIds
      })
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Catálogo atualizado com sucesso!',
        type: 'success'
      })

      set((state) => ({
        ...state,
        catalogsList: null
      }))
    } catch (error) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          'Erro ao atualizar catálogo! Tente novamente ou entre em contato com o suporte.',
        type: 'error'
      })
    }
  },
  handleCatalogActive: async (id: string, active: boolean) => {
    set((state) => ({
      ...state,
      catalogsList:
        state.catalogsList &&
        state.catalogsList.map((catalog) =>
          catalog.id === id ? { ...catalog, active } : catalog
        )
    }))

    try {
      useGlobalStore.getState().setError(null)
      useGlobalStore.getState().setLoading(true)

      await httpServices.catalog.update(id, {
        active
      })
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteCatalog: async (id: string) => {
    try {
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        catalogsList:
          state.catalogsList && state.catalogsList.filter((c) => c.id !== id)
      }))

      await httpServices.catalog.delete(id)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createCatalogsSlice
