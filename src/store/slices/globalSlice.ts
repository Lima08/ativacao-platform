import { IGlobalStore } from 'store/types/iGlobalStore'
import { StateCreator } from 'zustand'

const createGlobalSlice: StateCreator<IGlobalStore> = (set) => ({
  global: {
    company: {
      id: '',
      name: '',
      slug: '',
      imageUrl: ''
    },
    user: {
      id: '',
      name: '',
      email: '',
      role: 100,
      isActive: false
    }
  },
  loading: false,
  error: null,
  setError: (error: any) => set(() => ({ error })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
  setGlobal: (global) =>
    set((state) => {
      return { ...state, global }
    })
})

export default createGlobalSlice
