import handler from 'handler'
import { createCampaign } from 'useCases/campaigns'

// TODO: Colocar middleware de validação
export default handler.post(async (req, res) => {
  const { name, description, mediaIds } = req.body
  // TODO: Passar por token e no middleware decodificar
  const companyId = req.companyId!
  const userId = req.userId!

  const createdCampaign = await createCampaign({
    name,
    description,
    userId,
    companyId,
    mediaIds
  })
  return res.status(201).json({ data: createdCampaign })
})
