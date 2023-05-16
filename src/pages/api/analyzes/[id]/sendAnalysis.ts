import handler from 'handler'
import {
  updateAnalysis,
  deleteAnalysis,
  getAnalysisById
} from 'useCases/analyzes'

export default handler
  .get(async (req, res) => {
    const id = req.query.id as string

    const analysis = await getAnalysisById(id)
    return res.status(200).json({ data: analysis })
  })
  .put(async (req, res) => {
    const { status, biUrl, title } = req.body
    const id = req.query.id as string

    const updatedAnalysis = await updateAnalysis(id, {
      biUrl,
      status,
      title
    })

    return res.status(200).json({ data: updatedAnalysis })
  })
  .delete(async (req, res) => {
    const id = req.query.id as string

    await deleteAnalysis(id)
    return res.status(204).end()
  })
