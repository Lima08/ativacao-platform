import { FIVE_SECONDS } from 'constants/index'
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
  uploadPercentage: number | null
  setToaster: (toaster: IToaster) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: any) => void
  setTransferData: (transferData: any) => void
  setPage: (page: number) => void
  setRowsPerPage: (rows: number) => void
  setUploadPercentage: (percentage: number | null) => void
  resetUploadPercentage: () => void
}

const useGlobalStore = create<IGlobalStore>((set) => ({
  uploadPercentage: null,
  transferData: null,
  loading: false,
  error: null,
  toaster: {
    isOpen: false,
    message: 'Operação realizada com sucesso!',
    type: 'success',
    duration: FIVE_SECONDS
  },
  page: 0,
  rowsPerPage: 25,
  setToaster: (toaster) => set((state) => ({ ...state, toaster: toaster })),
  setLoading: (isLoading) => set((state) => ({ ...state, loading: isLoading })),
  setError: (error) => set((state) => ({ ...state, error: error })),
  setTransferData: (transferData) =>
    set((state) => ({ ...state, transferData })),
  setPage: (page) => set((state) => ({ ...state, page })),
  setRowsPerPage: (rows) => set((state) => ({ ...state, rowsPerPage: rows })),
  setUploadPercentage: (percentage) =>
    set((state) => ({ ...state, uploadPercentage: percentage })),

  resetUploadPercentage: () =>
    set((state) => ({
      ...state,
      uploadPercentage: null,
      totalPercentageToUpload: null
    }))
}))

export default useGlobalStore
