import {
  updateCampaign,
  deleteCampaign,
  getCampaignById
} from 'useCases/campaigns'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string
  if (req.method === 'GET') {
    const campaign = await getCampaignById(id)
    return res.status(200).json({ data: campaign })
  }
  if (req.method === 'PUT') {
    const { name, description, active, mediaIds } = req.body

    const updatedCampaign = await updateCampaign(id, {
      name,
      description,
      active,
      mediaIds
    })

    return res.status(200).json({ data: updatedCampaign })
  }

  if (req.method === 'DELETE') {
    await deleteCampaign(id)
    return res.status(204).end()
  }
}
