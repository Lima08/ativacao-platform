import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllLogs } from 'useCases/logs'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { role } = req.user!
    const id = req.query.id as string

    if (role < ROLES.COMPANY_ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
    }
    try {
      const Logs = await getAllLogs({ userId: id })
      return res.status(HTTP_STATUS.OK).json({ data: Logs })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
