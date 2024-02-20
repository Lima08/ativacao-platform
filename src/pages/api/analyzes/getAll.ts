import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllAnalyzes } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { role, companyId } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    const { status } = req.body

    const user = await getAllAnalyzes({ status, companyId })
    return res.status(HTTP_STATUS.OK).json({ data: user })
  }
}

export default authCheck(handler)
