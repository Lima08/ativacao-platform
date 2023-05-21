import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { createAnalysis } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method == REQUEST_METHODS.POST) {
    const { companyId, userId } = req.user!

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
    .json({ error: { message: 'Method not allowed' } })
}
export default authCheck(handler)
