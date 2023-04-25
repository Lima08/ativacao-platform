import { EAnalysisStatusType } from './EAnalysisStatus'

export interface IAnalysisFilter  {
  userId?: string
  status?: EAnalysisStatusType
}
