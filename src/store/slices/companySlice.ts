import {
  ICompany,
  ICompanyCreated,
  ICompanyModifier
} from 'interfaces/entities/company'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import { StateCreator } from 'zustand'

export interface ICompanyStore {
  currentCompany: ICompanyCreated | null
  companiesList: ICompanyCreated[] | null
  companyError: any | null
  resetCompanyState: () => void
  resetCompanyError: () => void
  setCurrentCompany: (company: ICompanyCreated) => void
  getCompanyById: (id: string) => void
  getAllCompanies: () => void
  createCompany: (newCompany: ICompany) => Promise<ICompanyCreated | undefined>
  updateCompany: (id: string, updatedCompany: ICompanyModifier) => void
}

const createCompanySlice: StateCreator<ICompanyStore> = (set) => ({
  currentCompany: null,
  companiesList: null,
  companyError: null,
  resetCompanyError: () => set(() => ({ companyError: null })),
  resetCompanyState: () =>
    set(() => ({
      currentCompany: null,
      companiesList: null,
      companyError: null
    })),
  setCurrentCompany: (company) =>
    set((state) => ({ ...state, currentCompany: company })),
  getCompanyById: async (id) => {
    try {
      const response = await httpServices.company.getById(id)
      set((state) => ({
        ...state,
        currentCompany: response?.data,
        error: response?.error
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao buscar empresa! Tente novamente ou contate o suporte.',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  getAllCompanies: async () => {
    useGlobalStore.getState().setLoading(true)
    try {
      const response = await httpServices.company.getAll()
      set((state) => ({
        ...state,
        companiesList: response.data
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message: error.message || 'Erro ao buscar empresas!',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  createCompany: async (newCompany: ICompany) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.company.create(newCompany)
      set((state) => ({
        ...state,
        companiesList: state.companiesList
          ? [...state.companiesList, response.data as ICompanyCreated]
          : [response.data as ICompanyCreated]
      }))

      return response.data
    } catch (error: any) {
      set((state) => ({
        ...state,
        companyError: {
          message:
            error.message ||
            'Erro ao registrar empresa! Tente novamente ou contate o suporte.'
        }
      }))
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  },
  updateCompany: async (id: string, updatedCompany: ICompanyModifier) => {
    useGlobalStore.getState().setLoading(true)

    try {
      const response = await httpServices.company.update(id, updatedCompany)
      set((state) => ({
        ...state,
        currentCompany: response.data as ICompanyCreated,
        companiesList:
          state.companiesList &&
          state.companiesList.map((company) =>
            company.id === id ? (response.data as ICompanyCreated) : company
          )
      }))
    } catch (error: any) {
      useGlobalStore.getState().setToaster({
        isOpen: true,
        message:
          error.message ||
          'Erro ao atualizar usuário! Tente novamente ou contate o suporte.',
        type: 'error'
      })
      return
    } finally {
      useGlobalStore.getState().setLoading(false)
    }
  }
})

export default createCompanySlice
