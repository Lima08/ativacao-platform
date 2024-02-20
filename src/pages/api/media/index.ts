import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { createMedia } from 'useCases/media'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HttpStatusCode.BadRequest).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.POST) {
    const { type, campaignId, trainingId, processId, url, key, cover } =
      req.body

    try {
      const media = await createMedia({
        type,
        campaignId,
        trainingId,
        processId,
        url,
        key,
        cover
      })
      return res.status(HttpStatusCode.Ok).json({ data: media })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
