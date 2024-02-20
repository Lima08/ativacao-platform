import { AxiosInstance } from 'axios'
import { IOrderCreated, IOrderModifier } from 'interfaces/entities/Order'

import { ApiResponse } from '../../../types'

export type CreateOrderPayload = {
  documentIds: string[]
  title: string
  templateOrderId: string
}

export interface OrderServiceInterface {
  create(payload: CreateOrderPayload): Promise<ApiResponse<IOrderCreated>>
  getAll(): Promise<ApiResponse<IOrderCreated[]>>
  update(
    id: string,
    modifierData: IOrderModifier
  ): Promise<ApiResponse<IOrderCreated>>
  delete(id: string): Promise<void>
}

const OrderService = (httpClient: AxiosInstance): OrderServiceInterface => ({
  create: async ({ documentIds, title, templateOrderId }) => {
    const response = await httpClient.post('/api/order/create', {
      documentIds,
      title,
      templateOrderId
    })
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/order/getAll')
    return response.data
  },

  update: async (id, modifierData) => {
    const response = await httpClient.put(`/api/order/${id}`, modifierData)

    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/order/${id}`)
  }
})

export default OrderService
