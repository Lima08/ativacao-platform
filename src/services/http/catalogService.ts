import { AxiosInstance } from 'axios'
import { ICatalogCreated } from 'interfaces/entities/catalog'

import { ApiResponse } from '../../../types'

type CreatePayload = {
  name: string
  description?: string
  mediaIds?: string[] | []
  documentIds?: string[] | []
}

type ModifierPayload = {
  name?: string
  description?: string
  active?: boolean
  mediaIds?: string[] | []
  mediasToExclude?: string[] | []
  documentIds?: string[] | []
  documentsToExclude?: string[] | []
}

export interface CatalogServiceInterface {
  create(payload: CreatePayload): Promise<ApiResponse<ICatalogCreated>>
  getById(catalogId: string): Promise<ApiResponse<ICatalogCreated>>
  getAll(): Promise<ApiResponse<ICatalogCreated[]>>
  update(
    catalogId: string,
    payload: ModifierPayload
  ): Promise<ApiResponse<ICatalogCreated>>
  delete(catalogId: string): Promise<void>
}

const CatalogService = (
  httpClient: AxiosInstance
): CatalogServiceInterface => ({
  create: async ({ name, description, mediaIds, documentIds }) => {
    const response = await httpClient.post('/api/catalog/create', {
      name,
      description,
      mediaIds,
      documentIds
    })

    return response.data
  },

  getAll: async () => {
    const response = await httpClient.get('/api/catalog/getAll')

    return response.data
  },
  getById: async (catalogId) => {
    const response = await httpClient.get(`/api/catalog/${catalogId}`)
    return response.data
  },

  update: async (
    catalogId,
    {
      name,
      description,
      active,
      mediaIds,
      mediasToExclude,
      documentIds,
      documentsToExclude
    }
  ) => {
    const response = await httpClient.put(`/api/catalog/${catalogId}`, {
      name,
      description,
      active,
      mediaIds,
      mediasToExclude,
      documentIds,
      documentsToExclude
    })

    return response.data
  },

  delete: async (catalogId: string) => {
    await httpClient.delete(`/api/catalog/${catalogId}`)
  }
})

export default CatalogService
