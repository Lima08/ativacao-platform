import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { getAllCampaigns } from 'useCases/campaigns'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { companyId, role } = req.user!

    try {
      let allCampaigns
      // TODO: Passar regra para caso de uso
      if (role < ROLES.COMPANY_ADMIN) {
        allCampaigns = await getAllCampaigns({ companyId, active: true })
      } else {
        allCampaigns = await getAllCampaigns({ companyId })
      }

      return res.status(HTTP_STATUS.OK).json({ data: allCampaigns })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
