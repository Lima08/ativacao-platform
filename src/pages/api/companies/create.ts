import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import createCompanySchema from 'schemasValidation/company/createCompanySchema'
import { createCompany } from 'useCases/companies'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { role } = req.user!

    if (role < ROLES.SYSTEM_ADMIN) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: { message: 'Forbidden' } })
    }

    const { name, slug, imageUrl } = req.body
    const { error } = createCompanySchema.validate({ name, slug, imageUrl })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.details[0].message })
    }

    try {
      await createCompany({ name, slug, imageUrl })

      return res.status(HTTP_STATUS.CREATED).end()
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
