import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { createLog } from 'useCases/logs'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { userId } = req.user!

    const { trainingId, campaignId, module, info, totalMedias, mediasWatched } =
      req.body

    try {
      const log = await createLog({
        userId,
        trainingId,
        campaignId,
        module,
        info,
        totalMedias,
        mediasWatched
      })

      return res.status(HTTP_STATUS.CREATED).json({ data: log })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
