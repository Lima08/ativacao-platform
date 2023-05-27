import { IAnalysisCreated } from 'interfaces/entities/analysis'
import httpServices from 'services/http'
import { IAnalysisStore } from 'store/types/IAnalysisStore'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

const createAnalysisSlice: StateCreator<IAnalysisStore> = (set) => ({
  currentAnalysis: null,
  analyzesList: [],
  resetCurrentAnalysis: () => set(() => ({ currentAnalysis: null })),
  createAnalysis: async (newAnalysis) => {
    try {
      useGlobalStore.getState().setLoading(true)
      const response = await httpServices.analysis.create(newAnalysis)

      set((state) => ({
        ...state,
        loading: false,
        analyzesList: [...state.analyzesList, response.data as IAnalysisCreated]
      }))
    
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllAnalyzes: async () => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.analysis.getAll()
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: response?.data,
        error: response?.error
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  done: async (id, { biUrl, message }) => {
    try {
      useGlobalStore.getState().setLoading(true)
      const response = await httpServices.analysis.done(id, { biUrl, message })
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  reject: async (id, message) => {
    try {
      useGlobalStore.getState().setLoading(true)
      const response = await httpServices.analysis.reject(id, message)
   

      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((analysis) =>
          analysis.id === id ? (response.data as IAnalysisCreated) : analysis
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  update: async (id, modifierData) => {
    try {
      useGlobalStore.getState().setLoading(true)
      const response = await httpServices.analysis.update(id, modifierData)

      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteAnalysis: async (id: string) => {
    useGlobalStore.getState().setLoading(true)

    try {
      set((state) => ({
        ...state,
        analyzesList: state.analyzesList.filter((c) => c.id !== id)
      }))

      await httpServices.analysis.delete(id)
    } catch (error) {
      useGlobalStore.getState().setError(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createAnalysisSlice
