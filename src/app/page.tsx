import Link from 'next/link'
import { Suspense } from 'react'

export default async function Homepage() {
  return (
    <main>
      <div className="flex gap-2">
        <Link href="/dashboard">entrar</Link>
      </div>
      <div className="container h-screen w-screen mx-auto flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        ></Suspense>
        <h1>Pagina inicial | Login </h1>
        {/* TODO: Adicionar logica para caso esteja locado ir direto para dashboard */}
      </div>
    </main>
  )
}
