import Link from 'next/link'
import { Suspense } from 'react'

export default async function Campaigns() {
  return (
    <main>
      <div className="flex gap-2">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/trainings">Treinamentos</Link>
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
        <h1>Campaign</h1>
      </div>
    </main>
  )
}
