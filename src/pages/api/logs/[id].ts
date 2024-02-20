import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { deleteLog, getLogById, updateLog } from 'useCases/logs'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  const { role } = req.user!

  if (role < ROLES.SYSTEM_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    const log = await getLogById(id)
    return res.status(HTTP_STATUS.OK).json({ data: log })
  }

  if (req.method === REQUEST_METHODS.PUT) {
    const { module, info, totalMedias, mediasWatched } = req.body

    try {
      const updatedLog = await updateLog(id, {
        module,
        info,
        totalMedias,
        mediasWatched
      })

      return res.status(HTTP_STATUS.OK).json({ data: updatedLog })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteLog(id)
      return res.status(HTTP_STATUS.NO_CONTENT).end()
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
