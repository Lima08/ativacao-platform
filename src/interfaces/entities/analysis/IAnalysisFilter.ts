import { eAnalysisStatusType } from './EAnalysisStatus'

export interface IAnalysisFilter {
  userId?: string
  status?: eAnalysisStatusType
  companyId?: string
  id?: string
}
