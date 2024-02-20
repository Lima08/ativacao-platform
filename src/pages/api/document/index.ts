import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { createDocument } from 'useCases/documents'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.POST) {
    const { url, key } = req.body

    try {
      const document = await createDocument({
        url,
        key
      })
      return res.status(HTTP_STATUS.OK).json({ data: document })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
