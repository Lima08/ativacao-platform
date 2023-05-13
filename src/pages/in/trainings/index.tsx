'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from 'store/useStore'
import PageContainer from 'components/PageContainer'
import DashboardLayout from 'components/DashboardLayout'
import SearchPrevNext from 'components/SearchPrevNext'
import Modal from 'components/MediaViewer'
import ListItem from 'components/ListItem'
import type { DataList } from 'components/ListItem'
import type { ITrainingCreated } from 'interfaces/entities/training'

interface mediaObject {
  url: string
  type: string
}

export default function TrainingsPage() {
  const router = useRouter()

  const [trainingsList, getAllTrainings, deleteTraining, error, loading] =
    useStore.Training((state) => [
      state.trainingsList,
      state.getAllTrainings,
      state.deleteTraining,
      state.error,
      state.loading
    ])

  const [trainingListAdapted, setTrainingListAdapted] = useState<DataList[]>([])
  const [open, setOpen] = useState(false)
  const [training, setTraining] = useState<{
    title: string
    description: string
    media: mediaObject[]
  }>({ title: '', description: '', media: [] })

  const handleEdit = async (id: string) => {
    router.push(`/in/training/${id}`)
  }

  const onClickRow = async (id: string) => {
    const training = trainingsList.find((training) => training.id === id)
    const media = training?.medias

    if (!media?.length) return alert('Nenhuma media encontrada')
    setTraining({
      title: training?.name || '',
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
          source:
            training?.medias[0]?.url ||
            'https://lojinha-da-aletha.dooca.store/admin/assets/logo-folded.1f809cab.svg',
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

  useEffect(() => {
    if (trainingsList.length > 0) return

    getAllTrainings()
  }, [])

  useEffect(() => {
    if (!error) return
    alert('Erro ao carregar treinamentos')
  }, [error])

  useEffect(() => {
    if (trainingsList.length === 0) return
    const trainingAdapted = trainingsAdapter(trainingsList)
    console.log(
      '🚀 ~ file: index.tsx:142 ~ useEffect ~ trainingAdapted:',
      trainingAdapted
    )
    setTrainingListAdapted(trainingAdapted)
  }, [trainingsList])
  console.log(
    '🚀 ~ file: index.tsx:148 ~ useEffect ~ trainingsList:',
    trainingsList
  )

  return (
    <DashboardLayout>
      <PageContainer pageTitle="Treinamentos" pageSection="trainings">
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        {!loading && !trainingListAdapted.length && (
          <p>Nenhum treinamento encontrado</p>
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
                // onClickToggle={updatetrainingStatus}
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

// const trainingsMOCK = [
//   {
//     id: '48e79836-b76d-4c8f-b264-0e32830fc14e',
//     name: 'Training 2025',
//     description: 'Descrição Training 2025',
//     active: true,
//     img: {
//       source:
//         'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/17f79061c2f027f3fa66a4d4a84408a59336728c7c73c2e7236f9c9c646605b5.fat_batman.jpg',
//       alt: 'Texto alternativo'
//     }
//   },
//   {
//     id: 'fecbae7b-693b-44e8-9355-f6b79b78613a',
//     name: 'App',
//     description: 'Testes',
//     active: true,
//     img: {
//       source:
//         'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/28a7a0a7a6d83becf6c144603c15e6f485df79b9b897fb0fc2d878fff32187ab.google_fb_hear_you.jpg',
//       alt: 'Texto alternativo'
//     }
//   },
//   {
//     id: 'c379fe52-03c1-40ed-99cd-378d6385712e',
//     name: 'Training 2025',
//     description: '123456789',
//     active: true,
//     img: {
//       source:
//         'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/42db7ddedc4efcac5d1991f1369853c376e14ad1dc26d17977e5bd4adf22376c.my_parents_me.jpg',
//       alt: 'Texto alternativo'
//     }
//   }
// ]
