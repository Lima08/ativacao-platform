import { Suspense } from 'react'

export default async function Trainings() {
  return (
    <main>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        ></Suspense>
        <h1>Análises</h1>
      </div>
    </main>
  )
}
