'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { ITrainingCreated } from 'interfaces/entities/training'
import useStore from 'store/useStore'

import DashboardLayout from 'components/DashboardLayout'
import ListItem from 'components/ListItem'
import type { DataList } from 'components/ListItem'
import Modal from 'components/MediaViewer'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

interface mediaObject {
  url: string
  type: string
}

export default function TrainingsPage() {
  const router = useRouter()

  const [
    trainingsList,
    getAllTrainings,
    handleTrainingActive,
    deleteTraining,
    error,
    loading
  ] = useStore.Training((state) => [
    state.trainingsList,
    state.getAllTrainings,
    state.handleTrainingActive,
    state.deleteTraining,
    state.error,
    state.loading
  ])

  const [trainingListAdapted, setTrainingListAdapted] = useState<DataList[]>([])
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

    if (!media?.length) return alert('Nenhuma media encontrada')
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
    alert('Erro ao carregar treinamentos')
  }, [error])

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
              <ListItem
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