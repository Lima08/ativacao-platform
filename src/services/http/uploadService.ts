import { AxiosInstance } from 'axios'

type Error = {
  message: string
  meta: Record<string, any>
}

type Create = {
  data?: any
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
