import type { ITemplateProcess } from './ITemplateProcess'

export interface ITemplateProcessCreated extends ITemplateProcess {
  id: string
  createdAt: Date
  updatedAt: Date
}
