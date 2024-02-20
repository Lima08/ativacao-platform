import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { createOrder } from 'useCases/Order'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, userId, role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'Unauthorized' })
  }

  if (req.method === REQUEST_METHODS.POST) {
    const { title, templateOrderId, documentIds } = req.body

    try {
      const createdOrder = await createOrder({
        title,
        templateOrderId,
        companyId,
        userId,
        documentIds
      })

      return res.status(HttpStatusCode.Created).json({ data: createdOrder })
    } catch (error: any) {
      return res
        .status(error.code || HttpStatusCode.InternalServerError)
        .json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
