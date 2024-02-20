import { IAnalysisCreated } from 'interfaces/entities/analysis'
import { IAnalysisModifier } from 'interfaces/entities/analysis'
import { eAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface IAnalysisStore {
  currentAnalysis: IAnalysisCreated | null
  analyzesList: IAnalysisCreated[] | null
  resetAnalysisState: () => void
  resetCurrentAnalysis: () => void
  createAnalysis: (newAnalysis: { title: string; bucketUrl: string }) => void
  getAllAnalyzes: () => void
  done: (
    id: string,
    { biUrl, message }: { biUrl: string; message: string }
  ) => void
  reject: (id: string, message: string) => void
  update: (id: string, modifierData: any) => void
  deleteAnalysis: (id: string) => void
}
const createAnalysisSlice: StateCreator<IAnalysisStore> = (set) => ({
  currentAnalysis: null,
  analyzesList: null,
  resetAnalysisState: () => {
    set(() => ({ analyzesList: null, currentAnalysis: null }))
  },
  resetCurrentAnalysis: () => set(() => ({ currentAnalysis: null })),
  createAnalysis: async (newAnalysis) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(false)

      const response = await httpServices.analysis.create(newAnalysis)

      set((state) => ({
        ...state,
        analyzesList: state.analyzesList
          ? [...state.analyzesList, response.data as IAnalysisCreated]
          : [response.data as IAnalysisCreated]
      }))
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Solicitação de análise  enviada com sucesso',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao enviar análise',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllAnalyzes: async () => {
    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.analysis.getAll()
      set((state) => ({
        ...state,
        analyzesList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar análises',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  done: async (id, { biUrl, message }) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        analyzesList:
          state.analyzesList &&
          state.analyzesList.map((analysis) => {
            if (analysis.id !== id) return analysis
            return {
              ...analysis,
              biUrl,
              message,
              status: eAnalysisStatusType.done
            }
          })
      }))
      await httpServices.analysis.done(id, { biUrl, message })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar análise',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  reject: async (id, message) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      await httpServices.analysis.reject(id, message)

      set((state) => ({
        ...state,
        analyzesList:
          state.analyzesList &&
          state.analyzesList.map((analysis) => {
            if (analysis.id !== id) return analysis
            return {
              ...analysis,
              message,
              status: eAnalysisStatusType.rejected
            }
          })
      }))

      await httpServices.analysis.reject(id, message)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar análise',
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
        analyzesList:
          state.analyzesList &&
          state.analyzesList.map((analysis) => {
            if (analysis.id !== id) return analysis

            return { ...analysis, ...modifierData }
          })
      }))

      await httpServices.analysis.update(id, modifierData)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar análise',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteAnalysis: async (id: string) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        analyzesList:
          state.analyzesList && state.analyzesList.filter((c) => c.id !== id)
      }))

      await httpServices.analysis.delete(id)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao deletar análise',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createAnalysisSlice
