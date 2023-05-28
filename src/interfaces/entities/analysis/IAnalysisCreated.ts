import { eAnalysisStatusType } from './EAnalysisStatus'
import type { IAnalysis } from './IAnalysis'

export interface IAnalysisCreated extends IAnalysis {
  id: string
  status: eAnalysisStatusType
  createdAt: Date
  updatedAt: Date
}
