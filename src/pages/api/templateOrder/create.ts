import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { createTemplateOrder } from 'useCases/templateOrder'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, role } = req.user!

  if (role < ROLES.SYSTEM_ADMIN) {
    return res.status(HttpStatusCode.Forbidden).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.POST) {
    const { bucketUrl, title } = req.body

    try {
      const templateOrder = await createTemplateOrder({
        bucketUrl,
        title,
        companyId
      })
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
