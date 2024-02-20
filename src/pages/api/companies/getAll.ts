import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { ICompanyFilter } from 'interfaces/entities/company'
import { authCheck } from 'middlewares/authCheck'
import { getAllCompanies } from 'useCases/companies'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { role, userId } = req.user!

    if (role < ROLES.SYSTEM_ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
    }

    const filter: ICompanyFilter = {}

    if (role < ROLES.SUPER_ADMIN) {
      filter.adminId = userId
    }

    try {
      const companies = await getAllCompanies(filter)
      return res.status(HTTP_STATUS.OK).json({ data: companies })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
