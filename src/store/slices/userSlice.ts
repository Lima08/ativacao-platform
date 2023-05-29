import { IUserCreated, IUserModifier } from 'interfaces/entities/user'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface IUserStore {
  currentUser: IUserCreated | null
  usersList: IUserCreated[]
  resetCurrentUser: () => void
  getUserById: (id: string) => void
  getAllUsers: () => void
  updateUser: (id: string, updatedUser: IUserModifier) => void
}

const createUserSlice: StateCreator<IUserStore> = (set) => ({
  currentUser: null,
  usersList: [],
  resetCurrentUser: async () => {
    set((state) => ({
      ...state,
      currentUser: null
    }))
  },
  getAllUsers: async () => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.user.getAll()
      set((state) => ({
        ...state,
        usersList: response.data
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getUserById: async (id) => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.user.getById(id)
      set((state) => {
        return {
          ...state,
          currentUser: response?.data,
          error: response?.error
        }
      })
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateUser: async (id: string, updatedUser: IUserModifier) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.user.update(id, updatedUser)
      set((state) => ({
        ...state,
        usersList: state.usersList.map((user) =>
          user.id === id ? (response.data as IUserCreated) : user
        )
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createUserSlice
