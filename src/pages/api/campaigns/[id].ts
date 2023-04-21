import handler from 'handler'
import { updateCampaign, deleteCampaign } from 'useCases/campaigns'

export default handler
  .put(async (req, res) => {
    const { name, description } = req.body
    const id = req.query.id as string

    const createdCampaign = await updateCampaign(id, {
      name,
      description
    })

    res.status(200).json({ data: createdCampaign })
  })
  .delete(async (req, res) => {
    const id = req.query.id as string

    await deleteCampaign(id)
    res.status(204).end()
  })
