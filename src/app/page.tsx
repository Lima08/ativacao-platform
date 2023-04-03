import Link from 'next/link'
import { Suspense } from 'react'

export default async function Homepage() {
  return (
    <div className="container h-screen w-screen mx-auto flex items-center justify-center">
      <h1 className="text-blue-950">hello world</h1>
      <Suspense
        fallback={
          <div>
            <h1>Carregando...</h1>
          </div>
        }
      >
        <h1>Pagina inicial </h1>
      </Suspense>
      <Link href="/campaigns">Campanhas</Link>
      <Link href="/trainings">Treinamentos</Link>
      <Link href="/analyzes">Análises</Link>
      <Link href="/processes">Processos</Link>
    </div>
  )
}
