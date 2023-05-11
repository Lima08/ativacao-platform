import { AxiosInstance } from 'axios'

type Media = {
  id: string
  url: string
  type: string
  key: string
  campaignId?: string
  trainingId?: string
  createdAt: Date
  updatedAt: Date
}

type Error = {
  message: string
  meta: Record<string, any>
}

type Create = {
  data?: Media[]
  error?: Error | null
}

export interface UploadServiceInterface {
  save(formData: FormData): Promise<Create>
}

const UploadService = (httpClient: AxiosInstance): UploadServiceInterface => ({
  save: async (formData) => {
    const response = await httpClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  }
})

export default UploadService
