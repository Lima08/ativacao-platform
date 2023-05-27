import { create } from 'zustand'

interface IToaster {
  isOpen: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}
export interface IAnalysisStore {
  transferData: any
  loading: boolean
  error: any
  toaster: IToaster
  setToaster: (toaster: IToaster) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: any) => void
  setTransferData: (transferData: any) => void
}

const useGlobalStore = create<IAnalysisStore>((set) => ({
  transferData: null,
  loading: false,
  error: null,
  toaster: {
    isOpen: false,
    message: '',
    type: 'success',
    duration: 5000
  },
  setToaster: (toaster) => set((state) => ({ ...state, toaster: toaster })),
  setLoading: (isLoading) => set((state) => ({ ...state, loading: isLoading })),
  setError: (error) => set((state) => ({ ...state, error: error })),
  setTransferData: (transferData) =>
    set((state) => ({ ...state, transferData }))
}))

export default useGlobalStore
