import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllCatalogs } from 'useCases/catalog'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { role } = req.user!

    try {
      let allCatalogs
      // TODO: Passar regra para caso de uso
      if (role < ROLES.COMPANY_ADMIN) {
        allCatalogs = await getAllCatalogs({ active: true })
      } else {
        allCatalogs = await getAllCatalogs({})
      }

      return res.status(HttpStatusCode.Ok).json({ data: allCatalogs })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
