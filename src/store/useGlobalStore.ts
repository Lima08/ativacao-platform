import { create } from 'zustand'

export interface IAnalysisStore {
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  setError: (error: any) => void
}

const useGlobalStore = create<IAnalysisStore>((set) => ({
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setError: (error) => set(() => ({ error: error }))
}))

export default useGlobalStore
