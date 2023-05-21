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
  done(id: string, message: string): Promise<ApiResponse<IAnalysisCreated>>
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
    try {
      const response = await httpClient.post('/api/analyzes/create', {
        title,
        bucketUrl
      })
      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to create analysis'
      throw new Error(message)
    }
  },
  getAll: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getAll')
      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to get analyzes'
      throw new Error(message)
    }
  },
  getExampleWorksheet: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getExampleWorksheet')
      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to get example worksheet'
      throw new Error(message)
    }
  },
  done: async (id, message) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, {
        status: EAnalysisStatusType.done,
        message
      })
      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to complete analysis'
      throw new Error(message)
    }
  },
  reject: async (id, message) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, {
        status: EAnalysisStatusType.rejected,
        message
      })
      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to reject analysis'
      throw new Error(message)
    }
  },
  update: async (id, modifierData) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, modifierData)

      return response.data
    } catch (error: any) {
      const message = error.message || 'Error to update analysis'
      throw new Error(message)
    }
  },
  delete: async (id) => {
    try {
      await httpClient.delete(`/api/analyzes/${id}`)
    } catch (error: any) {
      const message = error.message || 'Error to delete analysis'
      throw new Error(message)
    }
  }
})

export default AnalysisService
