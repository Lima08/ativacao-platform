'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { IAnalysisCreated } from 'interfaces/entities/analysis'
import useStore from 'store/useStore'

import DashboardLayout from 'components/DashboardLayout'
import ListAnalyzesItem from 'components/ListAnalyzesItem'
import Modal2 from 'components/Modal2'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

type IAnalyzesAdapted = Partial<IAnalysisCreated>

type AnalyzesObject = {
  id: string
  status: string
  title: string
  bucketUrl: string
  biUrl: string
}

export default function AnalyzesTable() {
  const router = useRouter()

  const [analyzesList, getAllByOwner, deleteAnalysis, loading] =
    useStore.Analysis((state) => [
      state.analyzesList,
      state.getAllByOwner,
      state.deleteAnalysis,
      state.loading
    ])
  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])
  const [open, setOpen] = useState(false)

  const analyzesAdapter = (
    analyzes: IAnalysisCreated[]
  ): IAnalyzesAdapted[] => {
    const result =
      analyzes.map((analysis) => ({
        id: analysis.id,
        status: analysis.status,
        title: analysis.title,
        bucketUrl: analysis.bucketUrl,
        biUrl: analysis.biUrl
      })) || []

    return result
  }

  const onClickStatus = () => {
    setOpen(true)
  }

  function deleteItem(id: string) {
    const userDecision = confirm('Confirmar deleção?')

    if (userDecision) {
      deleteAnalysis(id)
    }
  }

  useEffect(() => {
    getAllByOwner()
  }, [getAllByOwner])

  useEffect(() => {
    if (!analyzesList.length) return
    const listAdapted = analyzesAdapter(analyzesList)

    setAnalyzesListAdapted(listAdapted)
  }, [analyzesList])

  return (
    <DashboardLayout>
      <PageContainer
        pageTitle="Análises"
        pageSection="analyzes"
        onClickAdd={onClickStatus}
      >
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        <ul className="list-none mt-8 w-12/12">
          {!loading && !analyzesList.length && (
            <li className="flex items-center justify-center mt-5 bg-white h-12 w-full border rounded">
              Nenhuma analise encontrada
            </li>
          )}
          {!!analyzesListAdapted?.length &&
            analyzesListAdapted.map((analysis: AnalyzesObject) => (
              <li
                key={analysis.id}
                className="flex md:gap-10 hover:bg-slate-100 bg-white w-full border rounded max-h-18"
              >
                <ListAnalyzesItem data={analysis} onDelete={deleteItem} />
              </li>
            ))}

          {open && (
            <Modal2 open={open} setOpen={setOpen}>
              Analyses Uploader
            </Modal2>
          )}
        </ul>
      </PageContainer>
    </DashboardLayout>
  )
}
