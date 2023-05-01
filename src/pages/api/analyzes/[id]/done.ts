import handler from 'handler'
import { done } from 'useCases/analyzes'

export default handler.put(async (req, res) => {
  const id = req.query.id as string
  const { biUrl } = req.body

  const doneAnalysis = await done(id, {
    biUrl
  })

  res.status(200).json({ data: doneAnalysis })
})
