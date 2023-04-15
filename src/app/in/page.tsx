import { Suspense } from 'react'

export default async function Home() {
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
        <h1>Home</h1>
      </div>
    </main>
  )
}
