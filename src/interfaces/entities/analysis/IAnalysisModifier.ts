import { eAnalysisStatusType } from './EAnalysisStatus'

export interface IAnalysisModifier {
  status?: eAnalysisStatusType
  biUrl?: string
  title?: string
  message?: string
}
