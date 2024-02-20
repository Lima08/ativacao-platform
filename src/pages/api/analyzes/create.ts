import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { createAnalysis } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, userId, role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }

  if (req.method == REQUEST_METHODS.POST) {
    const { title, bucketUrl, message } = req.body
    const createdAnalysis = await createAnalysis({
      title,
      companyId,
      userId,
      message,
      bucketUrl
    })
    return res.status(HTTP_STATUS.CREATED).json({ data: createdAnalysis })
  }
  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}
export default authCheck(handler)
