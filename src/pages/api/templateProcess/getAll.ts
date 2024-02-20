import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllTemplateProcesses } from 'useCases/templateProcess'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { role, companyId } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const templateProcess = await getAllTemplateProcesses({ companyId })
      return res.status(HTTP_STATUS.OK).json({ data: templateProcess })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
