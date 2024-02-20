import { AxiosInstance } from 'axios'
import { IProcessCreated, IProcessModifier } from 'interfaces/entities/process'
import { eProcessStatus } from 'interfaces/entities/process/EProcessStatus'

import { ApiResponse } from '../../../types'

export type CreateProcessPayload = {
  documentIds: string[]
  title: string
  templateProcessId: string
}

export interface ProcessServiceInterface {
  create(payload: CreateProcessPayload): Promise<ApiResponse<IProcessCreated>>
  getAll(): Promise<ApiResponse<IProcessCreated[]>>
  done(
    id: string,
    { message }: { message: string }
  ): Promise<ApiResponse<IProcessCreated>>
  reject(id: string, message: string): Promise<ApiResponse<IProcessCreated>>
  update(
    id: string,
    modifierData: IProcessModifier
  ): Promise<ApiResponse<IProcessCreated>>
  delete(id: string): Promise<void>
  getById(id: string): Promise<ApiResponse<IProcessCreated>>
}

const ProcessService = (
  httpClient: AxiosInstance
): ProcessServiceInterface => ({
  create: async ({ documentIds, title, templateProcessId }) => {
    const response = await httpClient.post('/api/processes/create', {
      documentIds,
      title,
      templateProcessId
    })
    return response.data
  },
  getById: async (id) => {
    const response = await httpClient.get(`/api/processes/${id}`)
    return response.data
  },
  getAll: async () => {
    const response = await httpClient.get('/api/processes/getAll')
    return response.data
  },
  done: async (id, { message }) => {
    const response = await httpClient.put(`/api/processes/${id}`, {
      status: eProcessStatus.done,
      message
    })
    return response.data
  },
  reject: async (id, message) => {
    const response = await httpClient.put(`/api/processes/${id}`, {
      status: eProcessStatus.rejected,
      message
    })
    return response.data
  },
  update: async (id, modifierData) => {
    const response = await httpClient.put(`/api/processes/${id}`, modifierData)

    return response.data
  },
  delete: async (id) => {
    await httpClient.delete(`/api/processes/${id}`)
  }
})

export default ProcessService
