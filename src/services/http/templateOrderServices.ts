import { AxiosInstance } from 'axios'
import { ITemplateOrderCreated } from 'interfaces/entities/templateOrder'

import { ApiResponse } from '../../../types'

export type CreateTemplateOrderPayload = {
  title: string
  bucketUrl: string
}

export interface TemplateOrderInterface {
  create(
    payload: CreateTemplateOrderPayload
  ): Promise<ApiResponse<ITemplateOrderCreated>>
  getAll(): Promise<ApiResponse<ITemplateOrderCreated[]>>
  delete(id: string): Promise<void>
}

const TemplateOrderService = (
  httpClient: AxiosInstance
): TemplateOrderInterface => ({
  create: async ({ title, bucketUrl }) => {
    const response = await httpClient.post('/api/templateOrder/create', {
      title,
      bucketUrl
    })
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/templateOrder/getAll')
    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/templateOrder/${id}`)
  }
})

export default TemplateOrderService
