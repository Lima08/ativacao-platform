import Link from 'next/link'
import { Suspense } from 'react'

export default async function Trainings() {
  return (
    <main>
      {/* TODO: Transformar isso em navHeader em header */}
      <div className="flex gap-2">
        <Link href="/campaigns">Campanhas</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/analyzes">Análises</Link>
        <Link href="/processes">Processos</Link>
      </div>
      <div className="container h-screen w-screen mx-auto flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        ></Suspense>
        <h1>Treinamentos</h1>
      </div>
    </main>
  )
}
