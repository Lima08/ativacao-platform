import { ITemplateProcessCreated } from 'interfaces/entities/templateProcess'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface ITemplateProcessStore {
  templateProcessList: ITemplateProcessCreated[] | null
  resetTemplateProcessState: () => void
  createTemplateProcess: (newTemplateProcess: {
    title: string
    bucketUrl: string
  }) => void
  getAllTemplateProcesses: () => void
  deleteTemplateProcess: (id: string) => void
}
const createTemplateProcessSlice: StateCreator<ITemplateProcessStore> = (
  set
) => ({
  templateProcessList: null,
  resetTemplateProcessState: () => {
    set(() => ({ templateProcessList: null }))
  },
  createTemplateProcess: async (newTemplateProcess) => {
    try {
      useGlobalStore.getState().setLoading(true)
      useGlobalStore.getState().setError(false)

      const response = await httpServices.templateProcess.create(
        newTemplateProcess
      )

      set((state) => ({
        ...state,
        templateProcessList: state.templateProcessList
          ? [
              ...state.templateProcessList,
              response.data as ITemplateProcessCreated
            ]
          : [response.data as ITemplateProcessCreated]
      }))
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: 'Novo modelo criado com sucesso',
        type: 'success'
      })
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao criar modelo',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllTemplateProcesses: async () => {
    useGlobalStore.getState().setLoading(true)
    useGlobalStore.getState().setError(null)

    try {
      const response = await httpServices.templateProcess.getAll()
      set((state) => ({
        ...state,
        templateProcessList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao carregar análises',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  deleteTemplateProcess: async (id: string) => {
    useGlobalStore.getState().setError(null)

    try {
      set((state) => ({
        ...state,
        templateProcessList:
          state.templateProcessList &&
          state.templateProcessList.filter((c) => c.id !== id)
      }))

      await httpServices.templateProcess.delete(id)
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao deletar modelo',
        type: 'error'
      })
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createTemplateProcessSlice
