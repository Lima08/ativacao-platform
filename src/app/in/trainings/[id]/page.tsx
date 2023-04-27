'use client'
import CampaignRegister from 'components/CampaignRegister'
import UploadInput from 'components/UploadInput'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import httpServices from 'services/http'

const MOCK_DATA = {
  name: 'Campanha do cliente',
  description: 'Campanha enviada com o fetch e upload de mídia via front ',
  active: false
}

type Training = {
  name: string
  description: string
  active: boolean
  media: string[]
}

type MediaResponse = {
  id: string
  url: string
  type: string
  key: string
  trainingId?: string
  campaignId?: string
  createdAt: Date
  updatedAt: Date
}

export default function RegisterTraining() {
  const router = useRouter()
  const [files, setFiles] = useState<MediaResponse[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isMutating = isFetching || isPending
  const [title, setTitle] = useState('')
  const [description2, setDescription] = useState('')
  const [uploaded, setUploaded] = useState({})

  const uploadImage = async (e: any) => {
    e.preventDefault()

    const formData = new FormData()
    const file = e.target.files[0]
    formData.append('file', file)

    try {
      setIsFetching(true)
      const { data, error } = await httpServices.upload.save(formData)
      if (!!error) {
        throw new Error(error.message)
      }

      setFiles((prev) => {
        const newFile = data
        if (!newFile) {
          return prev
        }
        return [...prev, newFile]
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetching(false)
    }
  }

  // TODO: Tipar corretamente
  const createTraining = async (e: any) => {
    e.preventDefault()

    const { name, description, active } = MOCK_DATA
    // const { name, description } = MOCK_DATA
    // const name = title
    // const description = description2

    const mediaIds = files
      .map((media) => media.id)
      .filter((id) => id) as string[]

    try {
      setIsFetching(true)
      const { data, error } = await httpServices.trainings.create({
        name,
        description,
        mediaIds: mediaIds || []
      })

      setUploaded({
        name,
        description,
        mediaIds: mediaIds || []
      })

      console.log('🚀 ~ file: page.tsx:80 ~ createCampaign ~ {data, error}:', {
        data,
        error
      })
      //  TODO: Toast

      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className="w-full">
      <CampaignRegister
        isFetching={isFetching}
        uploadImage={uploadImage}
        createCampaign={createCampaign}
        title={title}
        setTitle={setTitle}
        description={description2}
        setDescription={setDescription}
        uploaded={uploaded}
      />
      {/* <h1>Upload</h1>
      <form
        onSubmit={createTraining}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        <UploadInput disabled={isFetching} handleSetFile={uploadImage} />
        <button disabled={isFetching} type="submit">
          salvar
        </button>
      </form>

      {isFetching && <div>salvando item...</div>} */}
    </div>
  )
}
