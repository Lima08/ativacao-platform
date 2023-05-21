import { IAnalysisCreated, IAnalysisModifier } from 'interfaces/entities/analysis'
import { CreateAnalysisPayload } from 'services/http/analysisServices '

export interface IAnalysisStore {
  currentAnalysis: IAnalysisCreated | null
  analyzesList: IAnalysisCreated[]
  loading: boolean
  error: any
  setLoading: (isLoading: boolean) => void
  resetCurrentAnalysis: () => void
  createAnalysis: (newAnalysis: CreateAnalysisPayload) => void
  getAll: () => void
  done: (id: string, message: string) => void
  reject: (id: string, message: string) => void
  update: (id: string, modifierData: IAnalysisModifier) => void
  deleteAnalysis: (id: string) => void
}
