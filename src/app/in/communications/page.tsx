import { Suspense } from 'react'

export default async function Communications() {
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
        <h1>Mural de Avisos</h1>
      </div>
    </main>
  )
}
