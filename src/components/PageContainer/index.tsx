'use client'
import { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  pageTitle: string
}

function PageContainer({ pageTitle, children }: PageContainerProps) {
  return (
    <div className="w-full">
      <div className="w-full flex p-[25px] items-center justify-around">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        <button className="bg-[#ffd700] hover:bg-gray-100 p-3 border border-slate-200 text-black font-medium rounded-md">
          Adicionar
        </button>
      </div>

      <div className="w-full flex flex-col">{children}</div>
    </div>
  )
}

export default PageContainer
