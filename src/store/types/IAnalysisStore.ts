import { IAnalysisCreated } from 'interfaces/entities/analysis'
import { CreateAnalysisPayload } from 'services/http/analysisServices '

export interface IAnalysisStore {
  currentAnalysis: IAnalysisCreated | null
  analyzesList: IAnalysisCreated[]
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  resetCurrentAnalysis: () => void
  createAnalysis: (newAnalysis: CreateAnalysisPayload) => void
  getAllByOwner: () => void
  done: (id: string) => void
  reject: (id: string) => void
  deleteAnalysis: (id: string) => void
}
