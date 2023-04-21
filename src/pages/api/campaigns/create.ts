import handler from 'handler'
import { createCampaign } from 'useCases/campaigns'

export default handler.post(async (req, res) => {
  const { name, description } = req.body
  const companyId = req.companyId!
  const userId = req.userId!

  const createdCampaign = await createCampaign({
    name,
    description,
    userId,
    companyId
  })
  res.status(201).json({ data: createdCampaign })
})
