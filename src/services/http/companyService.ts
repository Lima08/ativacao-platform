import { AxiosInstance } from 'axios'
import {
  ICompany,
  ICompanyCreated,
  ICompanyModifier
} from 'interfaces/entities/company'

import { ApiResponse } from '../../../types'

export interface CompanyServiceInterface {
  create(payload: ICompany): Promise<ApiResponse<ICompanyCreated>>
  getById(companyId: string): Promise<ApiResponse<ICompanyCreated>>
  getAll(): Promise<ApiResponse<ICompanyCreated[]>>
  update(
    companyId: string,
    payload: ICompanyModifier
  ): Promise<ApiResponse<ICompanyCreated>>
}

const CompanyService = (
  httpClient: AxiosInstance
): CompanyServiceInterface => ({
  create: async ({ name, slug, imageUrl }) => {
    const response = await httpClient.post('/api/companies/create', {
      name,
      slug,
      imageUrl
    })

    return response.data
  },

  getAll: async () => {
    const response = await httpClient.get('/api/companies/getAll')

    return response.data
  },
  getById: async (campaignId) => {
    const response = await httpClient.get(`/api/companies/${campaignId}`)
    return response.data
  },

  update: async (campaignId, { name, slug, imageUrl }) => {
    const response = await httpClient.put(`/api/companies/${campaignId}`, {
      name,
      slug,
      imageUrl
    })

    return response.data
  }
})

export default CompanyService
