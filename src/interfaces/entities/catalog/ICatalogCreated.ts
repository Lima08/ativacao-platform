import type { IDocumentCreated } from '../document'
import type { IMediaCreated } from '../media'
import type { ICatalog } from './ICatalog'

export interface ICatalogCreated extends ICatalog {
  id: string
  active: boolean
  medias: IMediaCreated[]
  documents: IDocumentCreated[]
  createdAt: Date
  updatedAt: Date
}
