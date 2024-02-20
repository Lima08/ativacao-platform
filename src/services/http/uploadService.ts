import axios, { AxiosInstance } from 'axios'
import { IDocument, IDocumentCreated } from 'interfaces/entities/document'
import { IMedia, IMediaCreated } from 'interfaces/entities/media'

type Error = {
  message: string
  meta: Record<string, any>
}

type response<T> = {
  data?: T
  error?: Error | null
}

type IPresignedParams = {
  key: string
  bucket: string
}

type IUploadPresignedParams = {
  presignedUrl: string
  file: any
}

export interface UploadServiceInterface {
  save(formData: FormData): Promise<response<any>>
  createMedia(mediaData: IMedia): Promise<response<IMediaCreated>>
  createDocument(documentData: IDocument): Promise<response<IDocumentCreated>>
  createPresignedUrl(
    presignedParams: IPresignedParams
  ): Promise<response<string>>
  uploadFileWithPresignedUrl(
    { presignedUrl, file }: IUploadPresignedParams,
    config?: Record<string, any>
  ): Promise<any>
}

const UploadService = (httpClient: AxiosInstance): UploadServiceInterface => ({
  save: async (formData) => {
    const response = await httpClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 0
    })

    return response.data
  },
  createMedia: async (mediaData) => {
    const response = await httpClient.post('/api/media', mediaData)

    return response.data
  },
  createDocument: async (documentData) => {
    const response = await httpClient.post('/api/document', documentData)

    return response.data
  },
  createPresignedUrl: async ({ bucket, key }) => {
    const response = await httpClient.post('/api/presignedUrl', { bucket, key })

    return response.data
  },

  uploadFileWithPresignedUrl: async ({ presignedUrl, file }, config = {}) => {
    const response = await axios
      .put(presignedUrl, file, config)
      .catch((err) => {
        console.error(err)
      })

    return response
  }
})

export default UploadService
