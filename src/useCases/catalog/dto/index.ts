import type {
  ICatalog,
  ICatalogCreated,
  ICatalogModifier
} from 'interfaces/entities/catalog'
import type { IDocumentCreated } from 'interfaces/entities/document'
import type { IMediaCreated } from 'interfaces/entities/media'

export interface newCatalogDto extends ICatalog {
  mediaIds?: string[]
  documentIds?: string[]
}

export interface createdCatalogDto extends ICatalogCreated {
  medias: IMediaCreated[]
  documents: IDocumentCreated[]
}

export interface modifierCatalogDto extends ICatalogModifier {
  medias?: any[]
  mediaIds?: string[]
  mediasToExclude?: string[]
  documents?: any[]
  documentIds?: string[]
  documentsToExclude?: string[]
}
