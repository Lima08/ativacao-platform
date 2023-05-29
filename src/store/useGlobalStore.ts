import { create } from 'zustand'

interface IToaster {
  isOpen: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}
export interface IGlobalStore {
  transferData: any
  loading: boolean
  error: any
  toaster: IToaster
  page: number
  rowsPerPage: number
  setToaster: (toaster: IToaster) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: any) => void
  setTransferData: (transferData: any) => void
  setPage: (page: number) => void
  setRowsPerPage: (rows: number) => void
}

const useGlobalStore = create<IGlobalStore>((set) => ({
  transferData: null,
  loading: false,
  error: null,
  toaster: {
    isOpen: false,
    message: '',
    type: 'success',
    duration: 5000
  },
  page: 0,
  rowsPerPage: 5,
  setToaster: (toaster) => set((state) => ({ ...state, toaster: toaster })),
  setLoading: (isLoading) => set((state) => ({ ...state, loading: isLoading })),
  setError: (error) => set((state) => ({ ...state, error: error })),
  setTransferData: (transferData) =>
    set((state) => ({ ...state, transferData })),
  setPage: (page) => set((state) => ({ ...state, page })),
  setRowsPerPage: (rows) => set((state) => ({ ...state, rowsPerPage: rows }))
}))

export default useGlobalStore
