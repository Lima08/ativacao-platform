import { AxiosInstance } from 'axios'
import {
  IAnalysisCreated,
  IAnalysisModifier
} from 'interfaces/entities/analysis'

import { ApiResponse } from '../../../types'

export type CreateAnalysisPayload = {
  title: string
  bucketUrl: string
}

export interface AnalysisServiceInterface {
  create(payload: CreateAnalysisPayload): Promise<ApiResponse<IAnalysisCreated>>
  getAllByOwner(): Promise<ApiResponse<IAnalysisCreated[]>>
  getExampleWorksheet(): Promise<ApiResponse<IAnalysisCreated>>
  done(id: string): Promise<ApiResponse<IAnalysisCreated>>
  reject(id: string): Promise<ApiResponse<IAnalysisCreated>>
  update(
    id: string,
    modifierData: IAnalysisModifier
  ): Promise<ApiResponse<IAnalysisCreated>>
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
    } catch (error) {
      console.error('Error to create Analysis:', error)
      return error
    }
  },
  getAllByOwner: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getAllByOwner')
      return response.data
    } catch (error) {
      console.error('Error to get Analysis by id:', error)
      return error
    }
  },
  getExampleWorksheet: async () => {
    try {
      const response = await httpClient.get('/api/analyzes/getExampleWorksheet')
      return response.data
    } catch (error) {
      console.error('Error to get example:', error)
      return error
    }
  },
  done: async (id) => {
    try {
      const response = await httpClient.get(`/api/analyzes/${id}/done`)
      return response.data
    } catch (error) {
      console.error('Error to get example:', error)
      return error
    }
  },
  reject: async (id) => {
    try {
      const response = await httpClient.get(`/api/analyzes/${id}/reject`)
      return response.data
    } catch (error) {
      console.error('Error to get example:', error)
      return error
    }
  },
  update: async (id, modifierData) => {
    try {
      const response = await httpClient.put(
        `/api/analyzes/${id}/update`,
        modifierData
      )

      return response.data
    } catch (error) {
      console.error('Error to update analysis:', error)
      return error
    }
  }
})

export default AnalysisService
