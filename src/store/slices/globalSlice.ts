import { IGlobalStore } from 'store/types/iGlobalStore'
import { StateCreator } from 'zustand'

const createGlobalSlice: StateCreator<IGlobalStore> = (set) => ({
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading }))
})

export default createGlobalSlice
