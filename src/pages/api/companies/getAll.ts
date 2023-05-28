import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllCompanies } from 'useCases/companies'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { role } = req.user!

    if (role < ROLES.SYSTEM_ADMIN) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: { message: 'Forbidden' } })
    }
    try {
      const companies = await getAllCompanies({})
      return res.status(HTTP_STATUS.OK).json({ data: companies })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
