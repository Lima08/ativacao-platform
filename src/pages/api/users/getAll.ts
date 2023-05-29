import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getUsers } from 'useCases/users'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, role, userId } = req.user!

  if (req.method === REQUEST_METHODS.GET) {
    try {
      let users = await getUsers({ companyId })
      if (role < ROLES.SYSTEM_ADMIN) {
        users = users.filter((user) => user.id === userId)
      }

      return res.status(HTTP_STATUS.OK).json({ data: users })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
