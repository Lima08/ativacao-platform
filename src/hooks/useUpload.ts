import { useRef } from 'react'

import {
  FIVE_SECONDS,
  MAX_FILE_SIZE,
  MAX_MEDIA_PER_LOAD,
  maxNameLength
} from 'constants/index'
import { generateS3FileUrl } from 'functions'
import { randomToken } from 'functions/randomToken'
import { IDocumentCreated } from 'interfaces/entities/document'
import { IMediaCreated } from 'interfaces/entities/media'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

export const useUpload = () => {
  const totalAlreadyUploaded = useRef(0)

  const [setError, setToaster, resetUploadPercentage, setUploadPercentage] =
    useGlobalStore((state) => [
      state.setError,
      state.setToaster,
      state.resetUploadPercentage,
      state.setUploadPercentage
    ])

  function configGenerate(
    fileType: string,
    totalToUpload?: number,
    totalUploaded?: number
  ) {
    return {
      headers: {
        'Content-Type': fileType
      },
      onUploadProgress: (progressEvent: any) => {
        const totalPercentage = totalToUpload || progressEvent.total
        totalAlreadyUploaded.current = totalUploaded
          ? totalUploaded + progressEvent.loaded
          : progressEvent.loaded

        const percentCompleted = Math.round(
          (totalAlreadyUploaded.current / totalPercentage) * 100
        )

        if (percentCompleted >= 100) {
          setUploadPercentage(99)

          return
        }

        setUploadPercentage(percentCompleted)
      }
    }
  }

  async function saveOnS3({
    file,
    bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_MEDIA!,
    totalToUpload,
    totalUploaded
  }: {
    file: File
    bucket?: string
    totalToUpload?: number
    totalUploaded?: number
  }): Promise<{ url: string; key: string }> {
    const key = `${randomToken()}.${file.name}`

    try {
      const presignedUrl = await httpServices.upload.createPresignedUrl({
        bucket,
        key
      })

      const config = configGenerate(file.type, totalToUpload, totalUploaded)
      await httpServices.upload.uploadFileWithPresignedUrl(
        {
          presignedUrl: presignedUrl.data!,
          file
        },
        config
      )
      const url = generateS3FileUrl(bucket, key)

      return { url, key }
    } catch (err: any) {
      console.error(err)
      throw new Error('Erro ao salvar o arquivo')
    }
  }

  const uploadVideo = async (file: File) => {
    if (file.name.length > maxNameLength) {
      setToaster({
        isOpen: true,
        message: 'Nome do arquivo muito grande!',
        type: 'warning',
        duration: FIVE_SECONDS
      })
      return
    }

    if (file.type.split('/')[0] !== 'video') {
      setToaster({
        isOpen: true,
        message: 'Formato de arquivo inválido! Apenas videos são aceitos',
        type: 'warning',
        duration: FIVE_SECONDS
      })
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setToaster({
        isOpen: true,
        message: 'Limite de 500MB por arquivo excedido!',
        type: 'warning'
      })
      return
    }

    setError(null)

    try {
      const { url, key } = await saveOnS3({ file })
      totalAlreadyUploaded.current = 0
      resetUploadPercentage()

      const mediaData = await httpServices.upload.createMedia({
        url,
        key,
        type: 'video'
      })

      return mediaData.data
    } catch (err: any) {
      console.error(err)
      setToaster({
        isOpen: true,
        message: 'Error ao salvar vídeo',
        type: 'error'
      })
    }
  }

  const uploadFiles = async (files: File[], isCover = false) => {
    for (const file of files) {
      if (file.name.length > maxNameLength) {
        setToaster({
          isOpen: true,
          message: 'Nome do arquivo muito grande!',
          type: 'warning',
          duration: FIVE_SECONDS
        })
        return
      }

      if (file.type.split('/')[0] !== 'image') {
        setToaster({
          isOpen: true,
          message: 'Formato de arquivo inválido! Apenas imagens são aceitos',
          type: 'warning',
          duration: FIVE_SECONDS
        })
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setToaster({
          isOpen: true,
          message: 'Limite de 500MB por arquivo excedido!',
          type: 'warning'
        })
        return
      }
    }

    if (files.length > MAX_MEDIA_PER_LOAD) {
      setToaster({
        isOpen: true,
        message: 'Limite de 10 arquivos por vez excedido!',
        type: 'warning'
      })
      return
    }

    const allMediasCreated: IMediaCreated[] = []

    const totalToUpload = Object.values(files).reduce(
      (acc, file) => acc + file.size,
      0
    )
    setError(null)

    let totalUploaded = 0
    for (const file of files) {
      try {
        const { url, key } = await saveOnS3({
          file,
          totalToUpload,
          totalUploaded
        })

        totalUploaded += file.size
        const mediaData = await httpServices.upload.createMedia({
          url,
          key,
          type: 'image',
          cover: isCover
        })

        if (!mediaData.data) {
          throw new Error('Error ao salvar imagens')
        }

        allMediasCreated.push(mediaData.data)
      } catch (err: any) {
        console.error(err)
        setToaster({
          isOpen: true,
          message: 'Error ao salvar imagens',
          type: 'error'
        })
      }
    }

    totalAlreadyUploaded.current = 0
    resetUploadPercentage()
    return allMediasCreated
  }

  const uploaderDocument = async (files: File[]) => {
    const FILE_FORMATS = [
      'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'pdf',
      'jpg',
      'jpeg',
      'png'
    ]
    for (const file of files) {
      const fileFormat = file?.type.split('/')[1]

      if (file.name.length > maxNameLength) {
        setToaster({
          isOpen: true,
          message: 'Nome do arquivo muito grande!',
          type: 'warning',
          duration: FIVE_SECONDS
        })
        return
      }

      if (!FILE_FORMATS.includes(fileFormat)) {
        setToaster({
          isOpen: true,
          message: 'Formato de arquivo inválido!',
          type: 'warning',
          duration: FIVE_SECONDS
        })
        return
      }
    }
    const allDocumentsCreated: IDocumentCreated[] = []
    const totalToUpload = Object.values(files).reduce(
      (acc, file) => acc + file.size,
      0
    )
    setError(null)

    let totalUploaded = 0
    for (const file of files) {
      try {
        const { url, key } = await saveOnS3({
          file,
          bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_DOC!,
          totalToUpload,
          totalUploaded
        })

        totalUploaded += file.size
        const documentData = await httpServices.upload.createDocument({
          url,
          key
        })

        if (!documentData.data) {
          throw new Error('Error ao salvar documento')
        }
        allDocumentsCreated.push(documentData.data)
      } catch (err: any) {
        console.error(err)
        setToaster({
          isOpen: true,
          message: 'Error ao salvar documento',
          type: 'error'
        })
      }
    }

    resetUploadPercentage()
    totalAlreadyUploaded.current = 0
    return allDocumentsCreated
  }

  return { uploadFiles, uploaderDocument, uploadVideo }
}
