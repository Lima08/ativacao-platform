import type { IDocument } from './IDocument'

export interface IDocumentCreated extends IDocument {
  id: string
  createdAt?: Date
  updatedAt?: Date
}
