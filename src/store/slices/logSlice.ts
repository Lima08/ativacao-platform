import { ILog } from 'interfaces/entities/log/ILog'
import { ILogCreated } from 'interfaces/entities/log/ILogCreated'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface ILogStore {
  currentLog: ILogCreated | null
  logsList: ILogCreated[] | null
  resetLogState: () => void
  resetCurrentLog: () => void
  createOrUpdate: (newLog: ILog) => void
  createLog: (newLog: ILog) => void
  getLogById: (id: string) => void
  getAllLogs: (userId: string) => void
  deleteLog: (id: string) => void
}

const createLogSlice: StateCreator<ILogStore> = (set) => ({
  currentLog: null,
  logsList: null,
  resetLogState: () => {
    set(() => ({ logsList: null, currentLog: null }))
  },
  resetCurrentLog: () => {
    set(() => ({ currentLog: null }))
  },
  getLogById: async (id) => {
    if (!id) return

    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.logs.getById(id)

      if (!response.data?.id) {
        useGlobalStore.getState().setError('error ao buscar histórico!')
        console.error(response)
        return
      }

      set((state) => ({
        ...state,
        currentLog: response?.data
      }))
    } catch (error) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar histórico!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllLogs: async (userId) => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.logs.getAll(userId)
      set((state) => ({
        ...state,
        logsList: response?.data
      }))
    } catch (error: any) {
      console.error(error)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Error ao buscar histórico!',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createOrUpdate: async (newLog) => {
    try {
      useGlobalStore.getState().setError(null)

      const response = await httpServices.logs.createOrUpdate(newLog)

      set((state) => ({
        ...state,
        currentLog: response.data as ILogCreated
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      console.error(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createLog: async (newLog) => {
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.logs.create(newLog)
      set((state) => ({
        ...state,
        currentLog: response.data as ILogCreated
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
      console.error(error)
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteLog: async (id) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        logsList:
          state.logsList && state.logsList.filter((log) => log.id !== id)
      }))

      await httpServices.logs.delete(id)
    } catch (error) {
      useGlobalStore.getState().setError(error)
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createLogSlice
