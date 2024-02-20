import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import createCatalogSchema from 'schemasValidation/catalog/createCatalogSchema'
import { createCatalog } from 'useCases/catalog'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { userId, role } = req.user!

    if (role < ROLES.COMPANY_ADMIN) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: 'Unauthorized' })
    }

    const { name, description, mediaIds, documentIds } = req.body
    const { error } = createCatalogSchema.validate({
      userId,
      name,
      description,
      mediaIds,
      documentIds
    })

    if (error) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: error.details[0].message })
    }

    try {
      const createdCatalog = await createCatalog({
        name,
        description,
        userId,
        mediaIds,
        documentIds
      })

      return res.status(HttpStatusCode.Created).json({ data: createdCatalog })
    } catch (error: any) {
      return res
        .status(error.code || HttpStatusCode.InternalServerError)
        .json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
