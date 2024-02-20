import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllTemplateOrder } from 'useCases/templateOrder'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HttpStatusCode.Forbidden).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const templateOrder = await getAllTemplateOrder({ companyId })
      return res.status(HttpStatusCode.Ok).json({ data: templateOrder })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
