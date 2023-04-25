import type { IAnalysis } from './IAnalysis'

export interface IAnalysisCreated extends IAnalysis {
  id: string
  createdAt: Date
  updatedAt: Date
}
