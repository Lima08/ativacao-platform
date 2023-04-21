import handler from 'handler'
import { getCampaigns } from 'useCases/campaigns'

export default handler.get(async (req, res) => {
  const companyId = req.companyId!

  const user = await getCampaigns({ companyId })
  res.status(200).json({ data: user })
})
