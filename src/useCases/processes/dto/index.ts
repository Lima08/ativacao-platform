import { IDocumentCreated } from 'interfaces/entities/document'
import { IProcess, IProcessCreated } from 'interfaces/entities/process'

export interface newProcessDto extends IProcess {
  documentIds: string[]
}

export interface createdProcessDto extends IProcessCreated {
  documents: IDocumentCreated[]
}
