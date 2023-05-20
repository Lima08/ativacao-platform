import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { getAllAnalyzes } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { companyId } = req.user!
    const { status } = req.body

    const user = await getAllAnalyzes({ status, companyId })
    return res.status(HTTP_STATUS.OK).json({ data: user })
  }
}

export default authCheck(handler)
