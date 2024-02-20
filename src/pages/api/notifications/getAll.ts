import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { getAllNotifications } from 'useCases/notifications'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { companyId } = req.user!
    const { title, userId } = req.query

    try {
      const allNotifications = await getAllNotifications({
        companyId,
        userId: userId as string,
        title: title as string
      })
      return res.status(HTTP_STATUS.OK).json({ data: allNotifications })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
