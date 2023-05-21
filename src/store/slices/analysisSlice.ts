import { IAnalysisCreated } from 'interfaces/entities/analysis'
import httpServices from 'services/http'
import { IAnalysisStore } from 'store/types/IAnalysisStore'
import { StateCreator } from 'zustand'

const createAnalysisSlice: StateCreator<IAnalysisStore> = (set) => ({
  currentAnalysis: null,
  analyzesList: [],
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  resetCurrentAnalysis: () => set(() => ({ currentAnalysis: null })),
  createAnalysis: async (newAnalysis) => {
    set({ loading: true })

    const response = await httpServices.analysis.create(newAnalysis)
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
        analyzesList: [...state.analyzesList, response.data as IAnalysisCreated]
      }))
    }
  },
  getAll: async () => {
    set({ loading: true })

    const response = await httpServices.analysis.getAll()
    set((state) => ({
      ...state,
      loading: false,
      analyzesList: response?.data,
      error: response?.error
    }))
  },
  done: async (id, message) => {
    set({ loading: true })

    const response = await httpServices.analysis.done(id, message)
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
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
  },
  reject: async (id, message) => {
    set({ loading: true })

    const response = await httpServices.analysis.reject(id, message)
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
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
  },
  update: async (id, modifierData) => {
    set({ loading: true })

    const response = await httpServices.analysis.update(id, modifierData)
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
        analyzesList: state.analyzesList.map((c) =>
          c.id === id ? (response.data as IAnalysisCreated) : c
        )
      }))
    }
  },
  deleteAnalysis: async (id: string) => {
    set((state) => ({
      ...state,
      analyzesList: state.analyzesList.filter((c) => c.id !== id)
    }))

    await httpServices.analysis.delete(id)
  }
})

export default createAnalysisSlice
