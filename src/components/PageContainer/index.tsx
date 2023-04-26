'use client'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

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
        <button
          className="bg-[#ffd700] hover:bg-gray-100 p-3 border border-slate-200 text-black font-medium rounded-md"
          onClick={navToCreatePage}
        >
          Adicionar
        </button>
      <div className="flex items-center flex-col justify-around">
        <div className="w-full flex p-[25px] items-center justify-around">
          <h1 className="text-2xl font-medium">{pageTitle}</h1>
          <a href="/in/campaigns/create">
            <button
              className="bg-yellow-400 hover:bg-yellow-300 p-3 border border-slate-200 text-black font-medium rounded-md"
              // onClick={addItem}
            >
              Adicionar {buttonTitle}
            </button>
          </a>
        </div>

        <div className="w-full flex flex-col">{children}</div>
      </div>

      <div className="w-full flex flex-col">{children}</div>
    </div>
  )
}
