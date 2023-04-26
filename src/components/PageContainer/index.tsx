'use client'
import { ReactNode, useContext } from 'react'
import { CampaignsContext } from '../../../context'

type PageContainerProps = {
  buttonTitle: string
  children: ReactNode
  pageTitle: string
}

function PageContainer({
  pageTitle,
  buttonTitle,
  children
}: PageContainerProps) {
  const { state, setState } = useContext(CampaignsContext)

  function addItem() {
    const item = {
      elementId: (Math.random() * 100).toFixed(1),
      itemTitle: `Campanha ${state.length + 1}`,
      itemDescription:
        'Campanha destinada a vender produtos da marca Y no verão de 2024'
    }

    const nextState = [...state, item]
    setState(nextState)
  }

  return (
    <div className="w-full">
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
    </div>
  )
}

export default PageContainer
