import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import FormCustom from 'components/FormCustom'
import MediaList from 'components/MediaList'
import Uploader from 'components/Uploader'

import { MediaResponseType } from '../../../../types'

export default function RegisterTraining() {
  const router = useRouter()
  const trainingId = router.query.id

  const [loading, setLoading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setLoading,
    state.setToaster
  ])
  const [
    currentTraining,
    getTrainingById,
    createTraining,
    updateTraining,
    resetCurrentTraining
  ] = useMainStore((state) => [
    state.currentTraining,
    state.getTrainingById,
    state.createTraining,
    state.updateTraining,
    state.resetCurrentTraining
  ])

  const [trainingName, setTrainingName] = useState('')
  const [trainingDescription, setTrainingDescription] = useState('')
  const [trainingsMedias, setTrainingMedias] = useState<MediaResponseType[]>([])

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
        setTrainingMedias((prevMediaList) => {
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

  const resetState = () => {
    return () => {
      setTrainingName('')
      setTrainingDescription('')
      setTrainingMedias([])
      resetCurrentTraining()
    }
  }

  const submitTraining = async (e: any) => {
    e.preventDefault()

    const mediaIds =
      trainingsMedias && trainingsMedias.length
        ? trainingsMedias.map((media) => media.id)
        : []


    if (!trainingId || trainingId === 'new') {
      createTraining({
        name: trainingName,
        description: trainingDescription,
        mediaIds
      })
    } else {
      updateTraining(String(trainingId), {
        name: trainingName,
        description: trainingDescription,
        mediaIds
      })
    }
    resetState()
  }

  const fetchTraining = async () => {
    if (!trainingId || trainingId === 'new') return

    getTrainingById(String(trainingId))
  }

  const removeMedia = (id: string) => {
    const medias = trainingsMedias.filter((media) => media.id !== id)
    setTrainingMedias(medias)
  }

  useEffect(() => {
    if (!currentTraining) return
    setTrainingName(currentTraining.name)
    setTrainingDescription(currentTraining?.description || '')
  }, [currentTraining])

  useEffect(() => {
    resetCurrentTraining()
    setTrainingName('')
    setTrainingDescription('')
    fetchTraining()
  }, [trainingId])

  return (
    <DashboardLayout>
      <div className="container flex items-center justify-start">
        <FormCustom submitForm={submitTraining}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Novo treinamento
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
                      value={trainingName}
                      onChange={(e) => setTrainingName(e.target.value)}
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
                      value={trainingDescription}
                      onChange={(e) => setTrainingDescription(e.target.value)}
                      autoComplete="description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <Uploader uploadFile={uploadFile} multiple />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <a href="/in/trainings">
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
              disabled={loading || loading}
            >
              Salvar
            </button>
          </div>

          <MediaList mediasList={trainingsMedias} onDelete={removeMedia} />
        </FormCustom>
      </div>
    </DashboardLayout>
  )
}
