'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import FormCustom from 'components/FormCustom'
import MediaList from 'components/MediaList'
import Uploader from 'components/Uploader'

import { MediaResponseType } from '../../../../types'

export default function RegisterCampaign() {
  const router = useRouter()
  const campaignId = router.query.id

  const [loading, setLoading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setLoading,
    state.setToaster
  ])
  const [
    currentCampaign,
    getCampaignById,
    createCampaign,
    updateCampaign,
    resetCurrentCampaign
  ] = useMainStore((state) => [
    state.currentCampaign,
    state.getCampaignById,
    state.createCampaign,
    state.updateCampaign,
    state.resetCurrentCampaign
  ])

  const [campaignName, setCampaignName] = useState('')
  const [campaignDescription, setCampaignDescription] = useState('')
  const [campaignMedias, setCampaignMedias] = useState<MediaResponseType[]>([])

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    if (files.length > 10) {
      setToaster({
        isOpen: true,
        message: 'Limite de 10 arquivos por vez excedido!',
        type: 'warning'
      })
      return
    }

    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }

    try {
      setLoading(true)
      const { data, error } = await httpServices.upload.save(formData)

      if (!!error || !data) {
        setToaster({
          isOpen: true,
          message: 'Error ao salvar medias',
          type: 'error'
        })
        return
      }

      for (const media of data) {
        setCampaignMedias((prevMediaList) => {
          return [...prevMediaList, media]
        })
      }
    } catch (error) {
      setToaster({
        isOpen: true,
        message: 'Error ao salvar dados',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetState = useCallback(() => {
    setCampaignName('')
    setCampaignDescription('')
    setCampaignMedias([])
    resetCurrentCampaign()
  }, [
    setCampaignName,
    setCampaignDescription,
    setCampaignMedias,
    resetCurrentCampaign
  ])

  const submitCampaign = async (e: any) => {
    e.preventDefault()

    const mediaIds =
      campaignMedias && campaignMedias?.length
        ? campaignMedias.map((media) => media.id)
        : []
    const mediasIdsFiltered = mediaIds.filter((id) => id) as string[]

    if (!campaignId || campaignId === 'new') {
      createCampaign({
        name: campaignName,
        description: campaignDescription,
        mediaIds: mediasIdsFiltered
      })
    } else {
      updateCampaign(String(campaignId), {
        name: campaignName,
        description: campaignDescription,
        mediaIds: mediasIdsFiltered
      })
    }
    resetState()
  }

  const fetchCampaign = useCallback(async () => {
    if (!campaignId || campaignId === 'new') return

    getCampaignById(String(campaignId))
  }, [campaignId, getCampaignById])

  const removeMedia = (id: string) => {
    const medias = campaignMedias.filter((media) => media.id !== id)
    setCampaignMedias(medias)
  }

  useEffect(() => {
    if (!currentCampaign) return
    setCampaignName(currentCampaign.name)
    setCampaignDescription(currentCampaign?.description || '')
  }, [currentCampaign])

  useEffect(() => {
    resetState()
    fetchCampaign()
  }, [campaignId, resetState, fetchCampaign])

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
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
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
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <Uploader uploadFile={uploadFile} multiple />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Link href="/in/campaigns">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              Salvar
            </button>
          </div>

          <MediaList mediasList={campaignMedias} onDelete={removeMedia} />
        </FormCustom>
      </div>
    </DashboardLayout>
  )
}
