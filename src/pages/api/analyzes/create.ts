import handler from 'handler'
import { createAnalysis } from 'useCases/analyzes'

export default handler.post(async (req, res) => {
  const userId = req.userId!
  const { title, bucketUrl } = req.body

  const createdTraining = await createAnalysis({
    title,
    userId,
    bucketUrl
  })
  return res.status(201).json({ data: createdTraining })
})
