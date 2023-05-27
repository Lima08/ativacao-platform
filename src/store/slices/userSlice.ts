import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

import { IUserStore } from '../types/iUserStore'

const createUserSlice: StateCreator<IUserStore> = (set) => ({
  // currentUser: null,
  usersList: [],
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
  }
  // resetCurrentUser: () => set(() => ({ currentUser: null })),
  // getUserById: async (id) => {
  //   try {
  //     const response = await httpServices.Users.getById(id)
  //     set((state) => ({
  //       ...state,
  //       currentUser: response?.data,
  //       error: response?.error
  //     }))
  //   } catch (error) {
  //     useGlobalStore.getState().setError(error)
  //     return
  //   } finally {
  //     useGlobalStore.getState().setLoading(false)
  //   }
  // },
  // createUser: async (newUser: CreatePayloadStore) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     const response = await httpServices.Users.create(newUser)
  //     set((state) => ({
  //       ...state,
  //       usersList: [
  //         ...state.usersList,
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
  // updateUser: async (id: string, updatedUser: modifierUserDto) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     const response = await httpServices.Users.update(id, updatedUser)
  //     set((state) => ({
  //       ...state,
  //       usersList: state.usersList.map((c) =>
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
  // handleUserActive: async (id: string, status: boolean) => {
  //   useGlobalStore.getState().setLoading(true)

  //   try {
  //     const response = await httpServices.Users.update(id, {
  //       active: status
  //     })
  //     set((state) => ({
  //       ...state,
  //       trainingsList: state.usersList.map((c) =>
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
