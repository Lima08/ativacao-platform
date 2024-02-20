import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import CustomError from 'errors/CustomError'
import { ICatalogCreated, ICatalogFilter } from 'interfaces/entities/catalog'
import { IDocumentCreated } from 'interfaces/entities/document'
import { IMediaCreated } from 'interfaces/entities/media'
import { prisma } from 'lib/prisma'
import { Catalog } from 'models/Catalog'

import { updateDocument, getDocumentBy, deleteDocument } from '../documents'
import { updateMedia, getMediasBy, deleteMedia } from '../media'
import { createdCatalogDto, newCatalogDto, modifierCatalogDto } from './dto'

const repository = Catalog.of(prisma)

async function createCatalog({
  name,
  description,
  userId,
  mediaIds,
  documentIds
}: newCatalogDto): Promise<ICatalogCreated> {
  try {
    const newCatalog = await repository.create({
      name,
      description,
      userId
    })
    if (!newCatalog)
      throw new CustomError('Erro ao criar catálogo', HTTP_STATUS.BAD_REQUEST)

    let medias: IMediaCreated[] = []
    if (newCatalog && mediaIds?.length) {
      const promises = mediaIds.map((mediaId) =>
        updateMedia(mediaId, { catalogId: newCatalog.id })
      )

      await Promise.all(promises)
        .then((files) => (medias = files))
        .catch((error: any) => {
          throw new CustomError(
            error.message || 'Erro ao criar mídias',
            HTTP_STATUS.BAD_REQUEST,
            error
          )
        })
    }

    let documents: IDocumentCreated[] = []
    if (newCatalog && documentIds?.length) {
      const promises = documentIds.map((documentId) =>
        updateDocument(documentId, { catalogId: newCatalog.id })
      )

      await Promise.all(promises)
        .then((files) => (documents = files))
        .catch((error: any) => {
          throw new CustomError(
            error.message || 'Erro ao criar documento',
            HTTP_STATUS.BAD_REQUEST,
            error
          )
        })
    }

    return { ...newCatalog, medias, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Erro ao criar catálogo',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  }
}

async function getCatalogById(id: string): Promise<createdCatalogDto> {
  try {
    const catalog = await repository.getOneBy(id)

    let medias: IMediaCreated[] = []
    if (catalog) {
      medias = await getMediasBy({ catalogId: catalog.id })
    }

    let documents: IDocumentCreated[] = []
    if (catalog) {
      documents = await getDocumentBy({ catalogId: catalog.id })
    }

    return { ...catalog, medias, documents }
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get catalog',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function getAllCatalogs(
  filter: ICatalogFilter
): Promise<ICatalogCreated[]> {
  try {
    const allCatalogs = await repository.getAll(filter)
    const allCatalogsWithMedia: ICatalogCreated[] = []

    for (const catalog of allCatalogs) {
      const medias = await getMediasBy({ catalogId: catalog.id })
      const documents = await getDocumentBy({ catalogId: catalog.id })

      allCatalogsWithMedia.push({
        ...catalog,
        medias: medias || [],
        documents: documents || []
      })
    }

    return allCatalogsWithMedia
  } catch (error: any) {
    throw new CustomError(
      error.message || 'Error to get catalogs',
      error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    )
  }
}

async function updateCatalog(
  id: string,
  {
    name,
    description,
    active,
    mediaIds,
    mediasToExclude,
    documentIds,
    documentsToExclude
  }: modifierCatalogDto
): Promise<createdCatalogDto> {
  const updatedCatalog = await repository
    .update(id, { name, description, active })
    .catch((error: any) => {
      if (error.message) {
        throw new CustomError(error.message, HTTP_STATUS.BAD_REQUEST, error)
      }
      throw new CustomError(
        'Erro ao atualizar catálogo',
        HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  let medias: IMediaCreated[] = []
  const mediaPromises = []

  let documents: IDocumentCreated[] = []
  const documentPromises = []

  if (mediaIds?.length) {
    for (const mediaId of mediaIds) {
      mediaPromises.push(updateMedia(mediaId, { catalogId: updatedCatalog.id }))
    }
  }

  if (documentIds?.length) {
    for (const documentId of documentIds) {
      documentPromises.push(
        updateDocument(documentId, { catalogId: updatedCatalog.id })
      )
    }
  }

  await Promise.all(mediaPromises)
    .then((files) => (medias = files))
    .catch((error: any) => {
      throw new CustomError(
        error.message || 'Erro ao atualizar mídias',
        error.code || HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  await Promise.all(documents)
    .then((files) => (documents = files))
    .catch((error: any) => {
      throw new CustomError(
        error.message || 'Erro ao atualizar documentos',
        error.code || HTTP_STATUS.BAD_REQUEST,
        error
      )
    })

  let promisesToExclude: any[] = []
  if (mediasToExclude?.length) {
    promisesToExclude = mediasToExclude.map((id) => deleteMedia(id))
  }

  if (documentsToExclude?.length) {
    promisesToExclude = documentsToExclude.map((id) => deleteDocument(id))
  }

  await Promise.all(promisesToExclude).catch((error: any) => {
    throw new CustomError(
      error.message || 'Erro ao deletar mídias e documentos',
      error.code || HTTP_STATUS.BAD_REQUEST,
      error
    )
  })

  return { ...updatedCatalog, medias, documents }
}

async function deleteCatalog(id: string): Promise<void> {
  const allMedias = await getMediasBy({ catalogId: id })
  if (allMedias.length) {
    const promises = allMedias.map((media) => deleteMedia(media.id))
    await Promise.all(promises).catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to delete catalog media',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }

  const allDocuments = await getDocumentBy({ catalogId: id })
  if (allDocuments.length) {
    const promises = allDocuments.map((document) => deleteDocument(document.id))
    await Promise.all(promises).catch((error: any) => {
      throw new CustomError(
        error.message || 'Error to delete catalog document',
        error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error
      )
    })
  }

  await repository.delete(id).catch((error: any) => {
    throw new CustomError(
      'Erro ao deletar catálogo',
      HTTP_STATUS.BAD_REQUEST,
      error
    )
  })
}

export {
  createCatalog,
  getCatalogById,
  getAllCatalogs,
  updateCatalog,
  deleteCatalog
}
