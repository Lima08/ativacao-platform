import { AxiosInstance } from 'axios'
import {
  IAnalysisCreated,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { EAnalysisStatusType } from 'interfaces/entities/analysis/EAnalysisStatus'

import { ApiResponse } from '../../../types'

export type CreateAnalysisPayload = {
  title: string
  bucketUrl: string
}

export interface AnalysisServiceInterface {
  create(payload: CreateAnalysisPayload): Promise<ApiResponse<IAnalysisCreated>>
  getAll(): Promise<ApiResponse<IAnalysisCreated[]>>
  getExampleWorksheet(): Promise<ApiResponse<IAnalysisCreated>>
  done(
    id: string,
    { biUrl, message }: { biUrl: string; message: string }
  ): Promise<ApiResponse<IAnalysisCreated>>
  reject(id: string, message: string): Promise<ApiResponse<IAnalysisCreated>>
  update(
    id: string,
    modifierData: IAnalysisModifier
  ): Promise<ApiResponse<IAnalysisCreated>>
  delete(id: string): Promise<void>
}

const AnalysisService = (
  httpClient: AxiosInstance
): AnalysisServiceInterface => ({
  create: async ({ title, bucketUrl }) => {
    const response = await httpClient.post('/api/analyzes/create', {
      title,
      bucketUrl
    })
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/analyzes/getAll')
    return response.data
  },
  getExampleWorksheet: async () => {
    const response = await httpClient.get('/api/analyzes/getExampleWorksheet')
    return response.data
  },
  done: async (id, { biUrl, message }) => {
    const response = await httpClient.put(`/api/analyzes/${id}`, {
      status: EAnalysisStatusType.done,
      message,
      biUrl
    })
    return response.data
  },
  reject: async (id, message) => {
    const response = await httpClient.put(`/api/analyzes/${id}`, {
      status: EAnalysisStatusType.rejected,
      message
    })
    return response.data
  },
  update: async (id, modifierData) => {
    const response = await httpClient.put(`/api/analyzes/${id}`, modifierData)

    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/analyzes/${id}`)
  }
})

export default AnalysisService
