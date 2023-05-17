import handler from 'handler'
import { getAnalysisById } from 'useCases/analyzes'

export default handler.get(async (_req, res) => {
  const exampleId = process.env.EXAMPLE_ANALYSIS_ID

  const user = await getAnalysisById(String(exampleId))
  return res.status(200).json({ data: user })
})
