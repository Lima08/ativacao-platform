import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { getAllAnalyzes } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { companyId, userId } = req.user!
    const { status } = req.body

    const user = await getAllAnalyzes({ status, userId, companyId })
    return res.status(200).json({ data: user })
  }
}

export default authCheck(handler)
