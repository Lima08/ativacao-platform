import handler from 'handler'
import { updateAnalysis } from 'useCases/analyzes'

export default handler.put(async (req, res) => {
  const { status, biUrl, title } = req.body
  const id = req.query.id as string

  const updatedAnalysis = await updateAnalysis(id, {
    biUrl,
    status,
    title
  })

  return res.status(200).json({ data: updatedAnalysis })
})
