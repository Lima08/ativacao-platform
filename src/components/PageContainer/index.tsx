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
    <div className="w-full">
      <div className="w-full flex p-[25px] items-center justify-around">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        <CustomButton onClick={navToCreatePage} variant="primary">
          <p>Adicionar</p>
        </CustomButton>
      </div>

      <div className="w-full flex flex-col">{children}</div>
    </div>
  )
}
