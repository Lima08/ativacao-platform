import { ReactNode, Suspense } from 'react'
import Loading from './loading'

export default async function TrainingLayout({
  children
}: {
  children: ReactNode
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}
