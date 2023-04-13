import { NextApiRequest, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/http/requestMethods'
import { createCampaign, getCampaigns } from 'useCases/campaigns'

// TEMP: This is just to test the API. It will be substituted by a id comes from the user token
const USER_ID = 'd36d7b27-9973-4294-ae7e-3e1ff2992a8d'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      const { name, description } = req.body
      const userId = USER_ID

      try {
        const createdCampaign = await createCampaign({
          name,
          description,
          userId
        })
        res.status(201).json({ data: createdCampaign })
      } catch (error) {
        res.status(500).json({ error: { message: 'Error creating campaign' } })
      }
      break

    case REQUEST_METHODS.GET:
      try {
        const campaigns = await getCampaigns({ userId: USER_ID })
        res.status(200).json({ data: campaigns })
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
