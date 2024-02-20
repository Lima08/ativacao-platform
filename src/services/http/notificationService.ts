import { AxiosInstance } from 'axios'
import {
  INotification,
  INotificationCreated,
  INotificationFilter,
  INotificationModifier
} from 'interfaces/entities/notification'

import { ApiResponse } from '../../../types'

export interface notificationServiceInterface {
  create(payload: INotification): Promise<ApiResponse<INotificationCreated>>
  getById(notificationId: string): Promise<ApiResponse<INotificationCreated>>
  getAll(
    filter?: INotificationFilter
  ): Promise<ApiResponse<INotificationCreated[]>>
  update(
    notificationId: string,
    payload: INotificationModifier
  ): Promise<ApiResponse<INotificationCreated>>
  delete(notificationId: string): Promise<void>
}

const notificationService = (
  httpClient: AxiosInstance
): notificationServiceInterface => ({
  create: async ({ title, description, imageUrl, link }) => {
    const response = await httpClient.post('/api/notifications/create', {
      title,
      description,
      imageUrl,
      link
    })

    return response.data
  },

  getAll: async (filters) => {
    const response = await httpClient.get('/api/notifications/getAll', {
      params: filters
    })

    return response.data
  },

  getById: async (notificationId) => {
    const response = await httpClient.get(
      `/api/notifications/${notificationId}`
    )

    return response.data
  },

  update: async (notificationId, { title, description, imageUrl, link }) => {
    const response = await httpClient.put(
      `/api/notifications/${notificationId}`,
      {
        title,
        description,
        imageUrl,
        link
      }
    )

    return response.data
  },

  delete: async (notificationId: string) => {
    await httpClient.delete(`/api/notifications/${notificationId}`)
  }
})

export default notificationService
