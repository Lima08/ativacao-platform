import { AxiosInstance } from 'axios'
import { ILog } from 'interfaces/entities/log/ILog'
import { ILogCreated } from 'interfaces/entities/log/ILogCreated'
import { ILogModifier } from 'interfaces/entities/log/ILogModifier'

import { ApiResponse } from '../../../types'

export interface LogServiceInterface {
  create(payload: ILog): Promise<ApiResponse<ILogCreated>>
  createOrUpdate(
    payload: ILog
  ): Promise<ApiResponse<ILogCreated | ILogCreated[]>>
  getById(logId: string): Promise<ApiResponse<ILogCreated>>
  getAll(userId?: string): Promise<ApiResponse<ILogCreated[]>>
  update(
    logId: string,
    payload: ILogModifier
  ): Promise<ApiResponse<ILogCreated>>
  delete(LogId: string): Promise<void>
}

const logService = (httpClient: AxiosInstance): LogServiceInterface => ({
  create: async ({
    trainingId,
    campaignId,
    module,
    info,
    totalMedias,
    mediasWatched
  }) => {
    const response = await httpClient.post('/api/logs/create', {
      trainingId,
      campaignId,
      module,
      info,
      totalMedias,
      mediasWatched
    })

    return response.data
  },
  createOrUpdate: async ({
    trainingId,
    campaignId,
    module,
    info,
    totalMedias,
    mediasWatched
  }) => {
    const response = await httpClient.post('/api/logs/createOrUpdate', {
      trainingId,
      campaignId,
      module,
      info,
      totalMedias,
      mediasWatched
    })

    return response.data
  },

  getAll: async (userId) => {
    const response = await httpClient.get(`/api/logs/getAll/${userId}`)
    return response.data
  },

  getById: async (logId) => {
    const response = await httpClient.get(`/api/logs/${logId}`)

    return response.data
  },

  update: async (logId, { module, info, totalMedias, mediasWatched }) => {
    const response = await httpClient.put(`/api/logs/${logId}`, {
      module,
      info,
      totalMedias,
      mediasWatched
    })

    return response.data
  },

  delete: async (logId: string) => {
    await httpClient.delete(`/api/logs/${logId}`)
  }
})

export default logService
