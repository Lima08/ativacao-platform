'use client'

import { useEffect, useState } from 'react'

import { IAnalysisCreated } from 'interfaces/entities/analysis'
import useStore from 'store/useStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import CustomModal from 'components/CustomModal'
import ListAnalyzesItem from 'components/ListAnalyzesItem'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

type IAnalyzesAdapted = Partial<IAnalysisCreated>

type AnalyzesObject = {
  id: string
  status: string
  message?: string | undefined
  title: string
  bucketUrl: string
  biUrl: string
}

export default function AnalyzesTable() {
  const [analyzesList, getAll, loading, deleteAnalysis] = useStore.Analysis(
    (state) => [
      state.analyzesList,
      state.getAll,
      state.loading,
      state.deleteAnalysis
    ]
  )

  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])
  const [open, setOpen] = useState(false)

  const analyzesAdapter = (
    analyzes: IAnalysisCreated[]
  ): IAnalyzesAdapted[] => {
    const result =
      analyzes.map((analysis) => ({
        id: analysis.id,
        status: analysis.status,
        message: analysis.message,
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
    getAll()
  }, [getAll])

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
            <CustomModal
              size="w-[400px] h-[400px]"
              open={open}
              setOpen={setOpen}
            >
              Analyses Uploader
            </CustomModal>
          )}
        </ul>
      </PageContainer>
    </DashboardLayout>
  )
}
