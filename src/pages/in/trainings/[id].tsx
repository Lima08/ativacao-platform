import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import PageRegisterTab from 'components/PageRegisterTab'

export default function RegisterTraining() {
  const router = useRouter()
  let trainingId = ''
  if (router.isReady) {
    trainingId = String(router.query.id)
  }

  const [loading, uploadPercentage] = useGlobalStore((state) => [
    state.loading,
    state.uploadPercentage
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

  const submitTraining = async ({
    name,
    description,
    mediaIds,
    mediasToExclude
  }: {
    name: string
    description: string
    mediaIds: any[]
    mediasToExclude: any[]
  }) => {
    if (!trainingId || trainingId === 'new') {
      createTraining({
        name,
        description,
        mediaIds
      })
    } else {
      updateTraining(String(trainingId), {
        name,
        description,
        mediaIds,
        mediasToExclude
      })
    }
    resetCurrentTraining()
    router.push('/in/trainings')
  }

  const fetchTraining = useCallback(() => {
    if (!trainingId || trainingId === 'new') {
      resetCurrentTraining()
      return
    }

    getTrainingById(String(trainingId))
  }, [resetCurrentTraining, trainingId, getTrainingById])

  useEffect(() => {
    fetchTraining()
  }, [trainingId, fetchTraining])

  return (
    <div className="container flex flex-col gap-4">
      <PageRegisterTab
        pageTitle="Treinamento"
        goBack={() => router.push('/in/trainings')}
        resetState={resetCurrentTraining}
        submit={submitTraining}
        currentItem={currentTraining}
      />

      {loading && !uploadPercentage && <LoadingScreen />}
    </div>
  )
}
