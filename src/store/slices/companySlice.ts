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
  companiesList: ICompanyCreated[]
  resetCurrentCompany: () => void
  getCompanyById: (id: string) => void
  getAllCompanies: () => void
  createCompany: (newCompany: ICompany) => void
  updateCompany: (id: string, updatedCompany: ICompanyModifier) => void
}

const createCompanySlice: StateCreator<ICompanyStore> = (set) => ({
  currentCompany: null,
  companiesList: [],
  resetCurrentCompany: () =>
    set((state) => ({ ...state, currentCompany: null })),
  getCompanyById: async (id) => {
    try {
      const response = await httpServices.company.getById(id)
      set((state) => ({
        ...state,
        currentCompany: response?.data,
        error: response?.error
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
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
        CompanyList: response.data
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
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
        CompanyList: [...state.companiesList, response.data as ICompanyCreated]
      }))
    } catch (error) {
      useGlobalStore.getState().setError(error)
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
        companiesList: state.companiesList.map((company) =>
          company.id === id ? (response.data as ICompanyCreated) : company
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

export default createCompanySlice
