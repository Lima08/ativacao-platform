import { NextApiRequestCustom, NextApiResponse } from 'next'

import { authCheck } from 'middlewares/authCheck'
import { createAnalysis } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method == 'POST') {
    const { companyId, userId } = req.user!

    const { title, bucketUrl, message } = req.body

    const createdTraining = await createAnalysis({
      title,
      companyId,
      userId,
      message,
      bucketUrl
    })
    return res.status(201).json({ data: createdTraining })
  }
  res.status(405).json({ error: { message: 'Method not allowed' } })
}
export default authCheck(handler)
