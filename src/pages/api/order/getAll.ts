import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllOrder } from 'useCases/Order'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId,  role } = req.user!


  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'Unauthorized' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const allOrder = await getAllOrder({ companyId })

      return res.status(HttpStatusCode.Ok).json({ data: allOrder })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
