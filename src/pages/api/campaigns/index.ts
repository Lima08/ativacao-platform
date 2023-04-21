import { NextApiRequest, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/enums/requestMethods'
import { createCampaign, getCampaigns } from 'useCases/campaigns'

// TEMP: This is just to test the API. It will be substituted by a id comes from the user token
const COMPANY_ID = '6d3482b1-b989-4db9-ac37-0668341e0ed4'
const USER_ID = 'd36d7b27-9973-4294-ae7e-3e1ff2992a8d'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      const { name, description } = req.body
      const userId = USER_ID
      const companyId = COMPANY_ID

      try {
        const createdCampaign = await createCampaign({
          name,
          description,
          userId,
          companyId
        })
        res.status(201).json({ data: createdCampaign })
      } catch (error) {
        res.status(500).json({ error })
      }
      break

    case REQUEST_METHODS.GET:
      try {
        const campaigns = await getCampaigns({ companyId: COMPANY_ID })
        res.status(200).json({ data: campaigns })
      } catch (error) {
        res.status(500).json({ error })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
