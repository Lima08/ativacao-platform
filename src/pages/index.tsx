import Link from 'next/link'
import { Suspense } from 'react'

export default function Homepage() {
  return (
    <main className="container h-screen w-screen mx-auto flex flex-col items-center justify-center">
      <div className="flex gap-2">
        <Link href="/in">Entrar</Link>
      </div>
      <div>
        {/* <Suspense
          fallback={
            <div>
              <h1>Carregando...</h1>
            </div>
          }
        ></Suspense> */}
        <h1>Pagina inicial | Login </h1>
      </div>
    </main>
  )
}
