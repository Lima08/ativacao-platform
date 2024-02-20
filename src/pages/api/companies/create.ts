import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import createCompanySchema from 'schemasValidation/company/createCompanySchema'
import { createCompany } from 'useCases/companies'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { role, userId } = req.user!

    if (role < ROLES.SUPER_ADMIN) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: 'Forbidden' })
    }

    const { name, slug, imageUrl } = req.body
    const { error } = createCompanySchema.validate({ name, slug, imageUrl })

    if (error) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: error.details[0].message })
    }

    try {
      const newCompany = await createCompany(userId, { name, slug, imageUrl })

      return res.status(HttpStatusCode.Created).json({ data: newCompany })
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
