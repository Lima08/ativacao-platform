import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { Campaign } from '../../../models/Campaign'
import { REQUEST_METHODS } from 'constants/http/requestMethods'

const repository = Campaign.of(prisma)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  if (!id)
    return res.status(404).json({
      message: `User with id: ${id} not found.`,
      name: 'User not found'
    })

  switch (req.method) {
    case REQUEST_METHODS.PUT:
      try {
        const { name, description } = req.body
        const updatedCampaign = await repository.update(id, {
          name,
          description
        })
        res.status(200).json({ data: updatedCampaign })
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    case REQUEST_METHODS.DELETE:
      try {
        await repository.delete(id)
        res.status(204).end()
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
