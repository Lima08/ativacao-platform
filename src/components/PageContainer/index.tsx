'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import CustomButton from 'components/CustomButton'

type PageContainerProps = {
  children: ReactNode
  pageTitle: string
  pageSection: string
}

export default function PageContainer({
  pageTitle,
  pageSection,
  children
}: PageContainerProps) {
  const router = useRouter()

  function navToCreatePage() {
    router.push(`/in/${pageSection}/new`)
  }

  return (
    <div className="w-full flex flex-col py-[25px] items-center">
      <div className="w-9/12 flex flex-row justify-around items-center">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        <CustomButton onClick={navToCreatePage} variant="primary">
          <p>Adicionar</p>
        </CustomButton>
      </div>
      <div className="flex flex-col mx-auto">{children}</div>
    </div>
  )
}
