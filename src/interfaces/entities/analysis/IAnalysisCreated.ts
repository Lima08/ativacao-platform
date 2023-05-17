import { EAnalysisStatusType } from './EAnalysisStatus'
import type { IAnalysis } from './IAnalysis'

export interface IAnalysisCreated extends IAnalysis {
  id: string
  status: EAnalysisStatusType
  createdAt: Date
  updatedAt: Date
}
