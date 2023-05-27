import {
  IAnalysisCreated,
  IAnalysisModifier
} from 'interfaces/entities/analysis'
import { CreateAnalysisPayload } from 'services/http/analysisServices '

export interface IAnalysisStore {
  currentAnalysis: IAnalysisCreated | null
  analyzesList: IAnalysisCreated[]
  resetCurrentAnalysis: () => void
  createAnalysis: (newAnalysis: CreateAnalysisPayload) => void
  getAllAnalyzes: () => void
  done: (
    id: string,
    { biUrl, message }: { biUrl: string; message: string }
  ) => void
  reject: (id: string, message: string) => void
  update: (id: string, modifierData: IAnalysisModifier) => void
  deleteAnalysis: (id: string) => void
}
