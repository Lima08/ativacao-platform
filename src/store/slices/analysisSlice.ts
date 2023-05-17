import {
  IAnalysisCreated,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import httpServices from 'services/http'
import { CreateAnalysisPayload } from 'services/http/analysisServices '
import { IAnalysisStore } from 'store/types/IAnalysisStore'
import { StateCreator } from 'zustand'

const createAnalysisSlice: StateCreator<IAnalysisStore> = (set) => ({
  currentAnalysis: null,
  analyzesList: [],
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  resetCurrentAnalysis: () => set(() => ({ currentAnalysis: null })),
  createAnalysis: async (newAnalysis: CreateAnalysisPayload) => {
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
  getAllByOwner: async () => {
    set({ loading: true })

    const response = await httpServices.analysis.getAllByOwner()
    set((state) => ({
      ...state,
      loading: false,
      analyzesList: response?.data,
      error: response?.error
    }))
  },
  done: async (id: string) => {
    set({ loading: true })

    const response = await httpServices.analysis.done(id)
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
  reject: async (id: string) => {
    set({ loading: true })

    const response = await httpServices.analysis.reject(id)
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
  update: async (id: string, modifierData: IAnalysisModifier) => {
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
  }
})

export default createAnalysisSlice
