import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { authCheck } from 'middlewares/authCheck'
import { getUsers } from 'useCases/users'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { companyId } = req.user!
    try {
      const user = await getUsers({ companyId })
      return res.status(200).json({ data: user })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
