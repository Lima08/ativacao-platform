import handler from 'handler'
import { getAllAnalyzes } from 'useCases/analyzes'

export default handler.get(async (req, res) => {
  const userId = req.userId!
  const { status } = req.body

  const user = await getAllAnalyzes({ status, userId })
  return res.status(200).json({ data: user })
})
