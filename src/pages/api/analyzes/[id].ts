import { NextApiRequestCustom, NextApiResponse } from 'next'

import { updateAnalysis, deleteAnalysis } from 'useCases/analyzes'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method == 'PUT') {
    const { biUrl, message, status } = req.body
    const id = req.query.id as string

    await updateAnalysis(id, { biUrl, message, status })
    return res.status(201).end()
  }

  if (req.method == 'DELETE') {
    const id = req.query.id as string

    await deleteAnalysis(id)
    return res.status(201).end()
  }

  res.status(405).json({ error: { message: 'Method not allowed' } })
}
