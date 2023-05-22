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
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  getAll: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getAll')
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  getExampleWorksheet: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getExampleWorksheet')
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  done: async (id, message) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, {
        status: EAnalysisStatusType.done,
        message
      })
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  reject: async (id, message) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, {
        status: EAnalysisStatusType.rejected,
        message
      })
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  update: async (id, modifierData) => {
    try {
      const response = await httpClient.put(`/api/analyzes/${id}`, modifierData)
      return response
    } catch (error: any) {
      throw new Error(error.message)
    }
  },
  delete: async (id) => {
    await httpClient.delete(`/api/analyzes/${id}`)
  }
})

export default AnalysisService
