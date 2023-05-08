'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import httpServices from 'services/http'
import FormCustom from 'components/FormCustom'
import { PhotoIcon } from '@heroicons/react/24/solid'
import DashboardLayout from 'components/DashboardLayout'
import useStore from 'store/useStore'

type MediaResponse = {
  id: string
  url: string
  type: string
  key: string
  campaignId?: string
  trainingId?: string
}

export default function RegisterCampaign({
  campaign,
  notFound
}: {
  campaign: any
  notFound: boolean
}) {
  const [isFetching, setIsFetching] = useState(false)
  const [files, setFiles] = useState<MediaResponse[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()
  const campaignId = router.query.id

  const uploadImage = async (e: any) => {
    // TODO: Adicionar essa logica no componente de update
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

  const submitCampaign = async (e: any) => {
    e.preventDefault()

    const mediaIds = files && files.length ? files.map((media) => media.id) : []
    const mediasIdsFiltered = mediaIds.filter((id) => id) as string[]

    try {
      if (!!campaign) {
        await useStore.getState().updateCampaign(String(campaign.id), {
          name,
          description,
          mediaIds: mediasIdsFiltered
        })
      } else {
        await useStore.getState().createCampaign({
          name,
          description,
          mediaIds: mediasIdsFiltered
        })
      }
    } catch (error) {
      console.error(error)
      // TODO: Colocar toast avisando que falhou ao salvar, apaga os dados e deixa o usuário tentar novamente
    } finally {
      // TODO: Colocar toast com mensagem avisando que salvou com sucesso antes de redirecionar
      router.push('/in/campaigns')
    }
  }

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId || campaignId === 'new') return

      try {
        console.log('🚀🚀 ~ file: index.tsx:97~ fetchCampaign ')
        const response = await httpServices.campaigns.getById(
          String(campaignId)
        )

        if (response.data) {
          const { name, description } = response.data
          if (!name || !description) return
          setName(name)
          setDescription(description)
          // setFiles(campaign.media)
        } else {
          router.push('/in/campaigns')
          // TODO: Criar página notFound e redirecionar para ela
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchCampaign()
  }, [campaignId])

  return (
    <DashboardLayout>
      <div className="container flex items-center justify-start">
        <FormCustom submitForm={submitCampaign}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Nova campanha
              </h2>

              <div className="mt-6">
                <div className="">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Título
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset outline-none focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Descrição
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoComplete="description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {/* TRansformar no componente upload */}
                <div className="mt-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Imagem de capa
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Subir arquivo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple={true}
                            disabled={isFetching}
                            onChange={(e) => uploadImage(e)}
                          />
                        </label>
                        {/* <p className="pl-1">ou arrastar</p> */}
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <a href="/in/campaigns">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancelar
              </button>
            </a>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={isFetching}
            >
              Salvar
            </button>
          </div>
          {isFetching && (
            <div className="px-3 py-2 w-[100px] mt-3 flex items-end justify-center ml-auto rounded-lg font-semibold bg-blue-600 text-white">
              Salvando item...
            </div>
          )}
        </FormCustom>
      </div>
    </DashboardLayout>
  )
}
