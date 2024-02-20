import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { updateAnalysis, deleteAnalysis } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method == REQUEST_METHODS.PUT) {
    const { biUrl, message, status } = req.body
    const id = req.query.id as string

    const updatedAnalysis = await updateAnalysis(id, { biUrl, message, status })
    return res.status(HTTP_STATUS.OK).json({ data: updatedAnalysis })
  }

  if (req.method == REQUEST_METHODS.DELETE) {
    const id = req.query.id as string

    await deleteAnalysis(id)
    return res.status(HTTP_STATUS.NO_CONTENT).end()
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}
export default authCheck(handler)
