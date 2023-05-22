import type { ICompany } from './ICompany'

export interface ICompanyCreated extends ICompany {
  id: string
  createdAt: Date
  updatedAt: Date
}
