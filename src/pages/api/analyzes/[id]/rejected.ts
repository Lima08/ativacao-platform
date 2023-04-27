import handler from 'handler'
import { rejected } from 'useCases/analyzes'

export default handler.put(async (req, res) => {
  const id = req.query.id as string

  const rejectedAnalysis = await rejected(id)

  res.status(200).json({ data: rejectedAnalysis })
})
