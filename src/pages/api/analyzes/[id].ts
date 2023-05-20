import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { updateAnalysis, deleteAnalysis } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method == REQUEST_METHODS.PUT) {
    const { biUrl, message, status } = req.body
    const id = req.query.id as string

    await updateAnalysis(id, { biUrl, message, status })
    return res.status(201).end()
  }

  if (req.method == REQUEST_METHODS.DELETE) {
    const id = req.query.id as string

    await deleteAnalysis(id)
    return res.status(201).end()
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}
export default authCheck(handler)
