import { AxiosInstance } from 'axios'
import {
  IDocumentCreated,
  IDocumentModifier
} from 'interfaces/entities/document'

import { ApiResponse } from '../../../types'

export type CreateProcessPayload = {
  title: string
  bucketUrl: string
}

export interface DocumentServiceInterface {
  create(payload: CreateProcessPayload): Promise<ApiResponse<IDocumentCreated>>
  getAll(): Promise<ApiResponse<IDocumentCreated[]>>
  update(
    id: string,
    modifierData: IDocumentModifier
  ): Promise<ApiResponse<IDocumentCreated>>
  delete(id: string): Promise<void>
}

const DocumentService = (
  httpClient: AxiosInstance
): DocumentServiceInterface => ({
  create: async ({ title, bucketUrl }) => {
    const response = await httpClient.post('/api/document/create', {
      title,
      bucketUrl
    })
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/document/getAll')
    return response.data
  },
  update: async (id, modifierData) => {
    const response = await httpClient.put(`/api/document/${id}`, modifierData)

    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/document/${id}`)
  }
})

export default DocumentService
