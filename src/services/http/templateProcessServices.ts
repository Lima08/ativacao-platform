import { AxiosInstance } from 'axios'
import { ITemplateProcessCreated } from 'interfaces/entities/templateProcess'

import { ApiResponse } from '../../../types'

export type CreateTemplateProcessPayload = {
  title: string
  bucketUrl: string
}

export interface TemplateProcessInterface {
  create(
    payload: CreateTemplateProcessPayload
  ): Promise<ApiResponse<ITemplateProcessCreated>>
  getAll(): Promise<ApiResponse<ITemplateProcessCreated[]>>
  delete(id: string): Promise<void>
}

const TemplateProcessService = (
  httpClient: AxiosInstance
): TemplateProcessInterface => ({
  create: async ({ title, bucketUrl }) => {
    const response = await httpClient.post('/api/templateProcess/create', {
      title,
      bucketUrl
    })
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/templateProcess/getAll')
    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/templateProcess/${id}`)
  }
})

export default TemplateProcessService
