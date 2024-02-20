import { IProcessCreated } from 'interfaces/entities/process'
import { eProcessStatus } from 'interfaces/entities/process/EProcessStatus'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface IProcessStore {
  currentProcess: IProcessCreated | null
  processList: IProcessCreated[] | null
  resetProcessState: () => void
  resetCurrentProcess: () => void
  createProcess: (newProcess: {
    documentIds: string[]
    title: string
    templateProcessId: string
  }) => void
  getAllProcesses: () => void
  processDone: (id: string, { message }: { message: string }) => void
  processReject: (id: string, message: string) => void
  processUpdate: (id: string, modifierData: any) => void
  deleteProcess: (id: string) => void
}

const createProcessSlice: StateCreator<IProcessStore> = (set) => ({
  currentProcess: null,
  processList: null,
  resetProcessState: () => {
    set(() => ({ processList: null, currentProcess: null }))
  },
  resetCurrentProcess: () => set(() => ({ currentProcess: null })),
  createProcess: async (newProcess) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(false)

      const response = await httpServices.process.create(newProcess)

      set((state) => ({
        ...state,
        processList: state.processList
          ? [response.data as IProcessCreated, ...state.processList]
          : [response.data as IProcessCreated]
      }))
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Processo aberto com sucesso',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao abrir processo',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllProcesses: async () => {
    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.process.getAll()
      set((state) => ({
        ...state,
        processList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar processos',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  processDone: async (id, { message }) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        processList:
          state.processList &&
          state.processList.map((process) => {
            if (process.id !== id) return process
            return {
              ...process,
              message,
              status: eProcessStatus.done
            }
          })
      }))
      await httpServices.process.done(id, { message })
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Status atualizado com sucesso.',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar processo',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  processReject: async (id, message) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        processList:
          state.processList &&
          state.processList.map((process) => {
            if (process.id !== id) return process
            return {
              ...process,
              message,
              status: eProcessStatus.rejected
            }
          })
      }))

      await httpServices.process.reject(id, message)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Status atualizado com sucesso.',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar processo',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  processUpdate: async (id, modifierData) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(null)

      set((state) => ({
        ...state,
        processList:
          state.processList &&
          state.processList.map((process) => {
            if (process.id !== id) return process

            return { ...process, ...modifierData }
          })
      }))

      await httpServices.process.update(id, modifierData)
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Status atualizado com sucesso.',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao atualizar processo',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteProcess: async (id: string) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        processList:
          state.processList && state.processList.filter((c) => c.id !== id)
      }))

      await httpServices.process.delete(id)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao deletar processo',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createProcessSlice
