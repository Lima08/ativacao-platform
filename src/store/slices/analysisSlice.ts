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
    useGlobalStore.getState().setLoading(true)
    const response = await httpServices.analysis.create(newAnalysis)

    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: [...state.analyzesList, response.data as IAnalysisCreated]
      }))
    }

    useGlobalStore.getState().setLoading(false)
  },
  getAll: async () => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.analysis.getAll()
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    set((state) => ({
      ...state,
      loading: false,
      analyzesList: response?.data,
      error: response?.error
    }))
  },
  done: async (id, message) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.analysis.done(id, message)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  reject: async (id, message) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.analysis.reject(id, message)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  update: async (id, modifierData) => {
    useGlobalStore.getState().setLoading(true)

    const response = await httpServices.analysis.update(id, modifierData)
    if (response && response.error) {
      useGlobalStore.getState().setError(response.error)
      return
    }

    if (response && response.data) {
      set((state) => ({
        ...state,
        loading: false,
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
    useGlobalStore.getState().setLoading(false)
  },
  deleteAnalysis: async (id: string) => {
    useGlobalStore.getState().setLoading(true)
    set((state) => ({
      ...state,
      analyzesList: state.analyzesList.filter((c) => c.id !== id)
    }))

    await httpServices.analysis.delete(id)
    useGlobalStore.getState().setLoading(false)
  }
})

export default createAnalysisSlice
