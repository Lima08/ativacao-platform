import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllProcesses } from 'useCases/processes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }
  
  if (req.method === REQUEST_METHODS.GET) {
    try {
      const allProcesses = await getAllProcesses({ companyId })

      return res.status(HTTP_STATUS.OK).json({ data: allProcesses })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
