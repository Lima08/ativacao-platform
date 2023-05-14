import handler from 'handler'
import { getAllCampaigns } from 'useCases/campaigns'

export default handler.get(async (req, res) => {
  const companyId = req.companyId!

  const allCampaigns = await getAllCampaigns({ companyId })
  return res.status(200).json({ data: allCampaigns })
})
