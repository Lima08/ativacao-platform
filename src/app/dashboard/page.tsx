import Link from 'next/link'
import { Suspense } from 'react'

export default async function Dashboard() {
  return (
    <div className="container h-screen w-screen mx-auto flex items-center justify-center">
      <Suspense
        fallback={
          <div>
            <h1>Carregando...</h1>
          </div>
        }
      >
        <h1>Dashboard</h1>
      </Suspense>
      <Link href="/">home</Link>
    </div>
  )
}
