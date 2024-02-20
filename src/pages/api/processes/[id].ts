import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import {
  updateProcess,
  getProcessById,
  deleteProcess
} from 'useCases/processes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const process = await getProcessById(id)
      return res.status(HTTP_STATUS.OK).json({ data: process })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { message, status, title } = req.body
    try {
      const updatedProcess = await updateProcess(id, {
        message,
        status,
        title
      })

      return res.status(HTTP_STATUS.OK).json({ data: updatedProcess })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteProcess(id)
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
