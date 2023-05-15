import handler from 'handler'
import {
  updateCampaign,
  deleteCampaign,
  getCampaignById
} from 'useCases/campaigns'

export default handler
  .get(async (req, res) => {
    const id = req.query.id as string

    const campaign = await getCampaignById(id)
    return res.status(200).json({ data: campaign })
  })
  .put(async (req, res) => {
    const { name, description, active, mediaIds } = req.body
    const id = req.query.id as string

    const updatedCampaign = await updateCampaign(id, {
      name,
      description,
      active,
      mediaIds
    })

    return res.status(200).json({ data: updatedCampaign })
  })
  .delete(async (req, res) => {
    const id = req.query.id as string

    await deleteCampaign(id)
    return res.status(204).end()
  })
