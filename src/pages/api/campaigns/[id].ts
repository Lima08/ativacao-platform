import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import {
  updateCampaign,
  deleteCampaign,
  getCampaignById
} from 'useCases/campaigns'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  if (req.method === REQUEST_METHODS.GET) {
    try {
      const campaign = await getCampaignById(id)
      return res.status(HTTP_STATUS.OK).json({ data: campaign })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { name, description, active, mediaIds, mediasToExclude } = req.body
    try {
      const updatedCampaign = await updateCampaign(id, {
        name,
        description,
        active,
        mediaIds,
        mediasToExclude
      })

      return res.status(HTTP_STATUS.OK).json({ data: updatedCampaign })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteCampaign(id)
      return res.status(HTTP_STATUS.NO_CONTENT).end()
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
