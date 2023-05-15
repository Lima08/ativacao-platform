import { StateCreator } from 'zustand'
import { IGlobalStore } from 'store/types/iGlobalStore'

const createGlobalSlice: StateCreator<IGlobalStore> = (set) => ({
  loading: false,
  error: null,
  setLoading: (isLoading) => set(() => ({ loading: isLoading }))
})

export default createGlobalSlice
