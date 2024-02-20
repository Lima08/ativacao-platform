import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { updateCatalog, deleteCatalog, getCatalogById } from 'useCases/catalog'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  if (req.method === REQUEST_METHODS.GET) {
    try {
      const catalog = await getCatalogById(id)
      return res.status(HttpStatusCode.Ok).json({ data: catalog })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const {
      name,
      description,
      active,
      mediaIds,
      mediasToExclude,
      documentIds,
      documentsToExclude
    } = req.body
    try {
      const updatedCatalog = await updateCatalog(id, {
        name,
        description,
        active,
        mediaIds,
        mediasToExclude,
        documentIds,
        documentsToExclude
      })

      return res.status(HttpStatusCode.Ok).json({ data: updatedCatalog })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteCatalog(id)
      return res.status(HttpStatusCode.NoContent).end()
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
