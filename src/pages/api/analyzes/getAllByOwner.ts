import { NextApiRequestCustom, NextApiResponse } from 'next'

import { getAllAnalyzes } from 'useCases/analyzes'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method == 'GET') {
    const userId = req.userId!
    const { status } = req.body

    const user = await getAllAnalyzes({ status, userId })
    return res.status(200).json({ data: user })
  }
  res.status(405).json({ error: { message: 'Method not allowed' } })
}
