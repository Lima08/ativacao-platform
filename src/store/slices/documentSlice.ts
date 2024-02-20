import { IDocumentCreated } from 'interfaces/entities/document'
import { IDocumentModifier } from 'interfaces/entities/document'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface IDocumentStore {
  documentList: IDocumentCreated[] | null
  resetDocumentState: () => void
  createDocument: (newDocument: { title: string; bucketUrl: string }) => void
  getAllDocuments: () => void
  update: (id: string, modifierData: any) => void
  deleteDocument: (id: string) => void
}

const createDocumentSlice: StateCreator<IDocumentStore> = (set) => ({
  documentList: null,
  resetDocumentState: () => {
    set(() => ({ documentList: null }))
  },
  createDocument: async (newDocument) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(false)

      const response = await httpServices.document.create(newDocument)

      set((state) => ({
        ...state,
        documentList: state.documentList
          ? [...state.documentList, response.data as IDocumentCreated]
          : [response.data as IDocumentCreated]
      }))
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Documento adicionado com sucesso',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao adicionar documento',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllDocuments: async () => {
    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.document.getAll()
      set((state) => ({
        ...state,
        processList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao adicionar documento',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  update: async (id, modifierData) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        documentList:
          state.documentList &&
          state.documentList.map((document) => {
            if (document.id !== id) return document

            return { ...document, ...modifierData }
          })
      }))

      await httpServices.document.update(id, modifierData)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar documento',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteDocument: async (id: string) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        documentList:
          state.documentList && state.documentList.filter((c) => c.id !== id)
      }))

      await httpServices.document.delete(id)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao deletar documento',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createDocumentSlice
