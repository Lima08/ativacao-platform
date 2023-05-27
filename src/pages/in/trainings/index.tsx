'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { ITrainingCreated } from 'interfaces/entities/training'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import ListItemCustom from 'components/ListItemCustom'
import type { DataList } from 'components/ListItemCustom'
import Modal from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

interface mediaObject {
  url: string
  type: string
}

export default function TrainingsPage() {
  const router = useRouter()

  const [trainingsList, getAllTrainings, handleTrainingActive, deleteTraining] =
    useMainStore((state) => [
      state.trainingsList,
      state.getAllTrainings,
      state.handleTrainingActive,
      state.deleteTraining
    ])

  const [trainingListAdapted, setTrainingListAdapted] = useState<DataList[]>([])
  const [loading, error, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.error,
    state.setToaster
  ])

  const [open, setOpen] = useState(false)
  const [training, setTraining] = useState<{
    title: string
    active: boolean
    description: string
    media: mediaObject[]
  }>({ title: '', active: true, description: '', media: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/trainings/${id}`)
  }

  const onClickRow = async (id: string) => {
    const training = trainingsList.find((training) => training.id === id)
    const media = training?.medias

    if (!media?.length) {
      setToaster({
        isOpen: true,
        message: 'Nenhuma media encontrada',
        type: 'warning'
      })
      return
    }
    setTraining({
      title: training?.name || '',
      active: training?.active || false,
      description: training?.description || '',
      media: mediasAdapter(training?.medias || [])
    })

    setOpen(true)
  }

  function mediasAdapter(mediasList: any[]) {
    const mediaURLs = mediasList.map(({ url, type }) => ({
      url,
      type
    }))
    return mediaURLs
  }

  // TODO: Corrigir a forma que define a imagem de capa

  function trainingsAdapter(trainingList: ITrainingCreated[]) {
    const trainingsAdapted = trainingList.map((training) => {
      return {
        id: training.id,
        name: training.name,
        description: training.description || null,
        active: training.active,
        img: {
          source: training?.medias[0]?.url || '/logo-ativacao.png',
          alt: 'Texto alternativo'
        }
      }
    })
    return trainingsAdapted
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteTraining(id)
    }
  }

  function handleTrainingStatus(id: string, active: boolean) {
    handleTrainingActive(id, active)
  }

  useEffect(() => {
    if (trainingsList.length > 0) return

    getAllTrainings()
  }, [])

  useEffect(() => {
    if (!error) return
    setToaster({
      isOpen: true,
      message: 'Um erro inesperado ocorreu.',
      type: 'error',
      duration: 5000
    })
  }, [error, setToaster])

  useEffect(() => {
    if (!trainingsList || trainingsList.length === 0) return
    const trainingAdapted = trainingsAdapter(trainingsList)
    setTrainingListAdapted(trainingAdapted)
  }, [trainingsList])

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Treinamentos" pageSection="trainings">
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        {!loading && !trainingListAdapted.length && (
          <li className="flex items-center justify-center mt-5 bg-white h-12 w-full border rounded">
            Nenhum treinamento encontrado
          </li>
        )}
        <ul className="list-none mt-8">
          {!!trainingListAdapted.length &&
            trainingListAdapted.map((training) => (
              <ListItemCustom
                key={training.id}
                data={training}
                onDelete={() => deleteItem(training.id)}
                onEdit={handleEdit}
                onClickRow={onClickRow}
                onClickToggle={handleTrainingStatus}
              />
            ))}
        </ul>

        {open && (
          <Modal
            title={training.title}
            description={training.description}
            imageSource={
              training.media[0].type === 'image'
                ? training.media[0]
                : 'default img src'
            }
            medias={training.media}
            open={open}
            setOpen={setOpen}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  )
}
