import {
  ICompany,
  ICompanyCreated,
  ICompanyModifier
} from 'interfaces/entities/company'

export interface ICompanyStore {
  currentCompany: ICompanyCreated | null
  companiesList: ICompanyCreated[]
  resetCurrentCompany: () => void
  getCompanyById: (id: string) => void
  getAllCompanies: () => void
  createCompany: (newCompany: ICompany) => void
  updateCompany: (id: string, updatedCompany: ICompanyModifier) => void
}
