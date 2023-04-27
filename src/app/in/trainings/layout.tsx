import { ReactNode, Suspense } from 'react'
import { TrainingsContextProvider } from 'context/TrainingsContext'
import { getAllTrainings } from 'useCases/trainings'

// export const revalidate = 3600
export default async function trainingLayout({
  children
}: {
  children: ReactNode
}) {
  // TODO: Virá do localStorage
  const allTraining = await getAllTrainings({
    companyId: 'dfda4d4a-df82-47c3-bb5e-391cc4589ea1'
  })

  function adapterTrainingToList(Training: any[]) {
    return Training.map((training) => {
      return {
        id: training.id,
        name: training.name,
        description: training.description,
        active: training.active,
        userId: training.userId,
        companyId: training.companyId
      }
    })
  }

  return (
    <section>
      <TrainingsContextProvider
        listTrainings={adapterTrainingToList(allTraining)}
      >
        <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        >
          {children}
        </Suspense>
      </TrainingsContextProvider>
    </section>
  )
}
