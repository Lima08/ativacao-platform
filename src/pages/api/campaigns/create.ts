import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import campaign from 'schemaValidation/campaignSchema'
import { createCampaign } from 'useCases/campaigns'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { companyId, userId, role } = req.user!

    if (role < ROLES.COMPANY_ADMIN) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: { message: 'Unauthorized' } })
    }
    
    const { name, description, mediaIds } = req.body
    const { error } = campaign.createSchema.validate({
      companyId,
      userId,
      name,
      description,
      mediaIds
    })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.details[0].message })
    }

    try {
      const createdCampaign = await createCampaign({
        name,
        description,
        userId,
        companyId,
        mediaIds
      })

      return res.status(HTTP_STATUS.CREATED).json({ data: createdCampaign })
    } catch (error: any) {
      return res
        .status(error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
