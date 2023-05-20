import { NextApiRequestCustom, NextApiResponse } from 'next'

import { createAnalysis } from 'useCases/analyzes'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method == 'POST') {
    const userId = req.userId!
    const companyId = req.companyId!
    const { title, bucketUrl } = req.body

    const createdTraining = await createAnalysis({
      title,
      userId,
      bucketUrl
    })
    return res.status(201).json({ data: createdTraining })
  }
  res.status(405).json({ error: { message: 'Method not allowed' } })
}
