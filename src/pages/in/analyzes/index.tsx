'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { IAnalysisCreated } from 'interfaces/entities/analysis'
import useStore from 'store/useStore'

import DashboardLayout from 'components/DashboardLayout'
import ListAnalyzesItem from 'components/ListAnalyzesItem'
import PageContainer from 'components/PageContainer'
import SearchPrevNext from 'components/SearchPrevNext'

type IAnalyzesAdapted = Partial<IAnalysisCreated>

export default function AnalyzesTable() {
  const router = useRouter()

  const [analyzesList, getAllByOwner, loading] = useStore.Analysis((state) => [
    state.analyzesList,
    state.getAllByOwner,
    state.loading
  ])
  const [analyzesListAdapted, setAnalyzesListAdapted] = useState<any>([])

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

  const onClickRow = (id: string) => {
    router.push(`/in/analyzes/${id}`)
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
      <PageContainer pageTitle="Análises" pageSection="analyzes">
        <SearchPrevNext />
        {loading && <p>Carregando...</p>}
        <ul className="list-none mt-8">
          {!loading && !analyzesList.length && (
            <li className="flex items-center justify-center mt-5 bg-white h-12 w-full border rounded">
              Nenhuma analise encontrada
            </li>
          )}
          {!!analyzesListAdapted?.length &&
            analyzesListAdapted.map((analysis: any) => (
              <li key={analysis.id} onClick={() => onClickRow(analysis.id)}>
                <ListAnalyzesItem data={analysis} />
              </li>
            ))}
        </ul>
      </PageContainer>
    </DashboardLayout>
  )
}
