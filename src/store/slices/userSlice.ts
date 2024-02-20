import { IUserCreated, IUserModifier } from 'interfaces/entities/user'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface IUserStore {
  currentUser: IUserCreated | null
  usersList: IUserCreated[] | null
  resetUserState: () => void
  setCurrentUser: (user: IUserCreated) => void
  resetCurrentUser: () => void
  getUserById: (id: string) => void
  getAllUsers: () => void
  updateUser: (id: string, updatedUser: IUserModifier) => void
}

const createUserSlice: StateCreator<IUserStore> = (set) => ({
  currentUser: null,
  usersList: null,
  resetUserState: () => {
    set(() => ({ usersList: null, currentUser: null }))
  },
  setCurrentUser: (user) => {
    set((state) => ({
      ...state,
      currentUser: user
    }))
  },
  resetCurrentUser: async () => {
    set((state) => ({
      ...state,
      currentUser: null
    }))
  },
  getAllUsers: async () => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

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
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

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
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      const response = await httpServices.user.update(id, updatedUser)
      set((state) => ({
        ...state,
        usersList:
          state.usersList &&
          state.usersList.map((user) =>
            user.id === id ? (response.data as IUserCreated) : user
          )
      }))

      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Usuário atualizado com sucesso!',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao registrar usuário! Tente novamente ou contate o suporte.',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createUserSlice
