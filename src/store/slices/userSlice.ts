import { IUserCreated, IUserModifier } from 'interfaces/entities/user'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

import { IUserStore } from '../types/iUserStore'

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
      console.log('🚀 ~ file: userSlice.ts:62 ~ updateUser: ~ error:', error)
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
  // createUser: async (newUser: CreatePayloadStore) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     const response = await httpServices.user.create(newUser)
  //     set((state) => ({
  //       ...state,
  //       userList: [
  //         ...state.userList,
  //         response.data as IUserCreated
  //       ]
  //     }))
  //   } catch (error) {
  //     useGlobalStore.getState().setError(error)
  //     return
  //   } finally {
  //     useGlobalStore.getState().setLoading(false)
  //   }
  // },

  // handleUserActive: async (id: string, status: boolean) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     const response = await httpServices.user.update(id, {
  //       active: status
  //     })
  //     set((state) => ({
  //       ...state,
  //       trainingsList: state.userList.map((c) =>
  //         c.id === id ? (response.data as IUserCreated) : c
  //       )
  //     }))
  //   } catch (error) {
  //     useGlobalStore.getState().setError(error)
  //     return
  //   } finally {
  //     useGlobalStore.getState().setLoading(false)
  //   }
  // },
  // deleteUser: async (id: string) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     set((state) => ({
  //       ...state,
  //       usersList: state.usersList.filter((c) => c.id !== id)
  //     }))

  //     await httpServices.Users.delete(id)
  //   } catch (error) {
  //     useGlobalStore.getState().setError(error)
  //     return
  //   } finally {
  //     useGlobalStore.getState().setLoading(false)
  //   }
  // }
})

export default createUserSlice
