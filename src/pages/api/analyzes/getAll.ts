import handler from 'handler'
import { getAllAnalyzes } from 'useCases/analyzes'

export default handler.get(async (req, res) => {
  const userId = req.userId!
  const { status } = req.body // TODO: Passar para patametros de rota

  const user = await getAllAnalyzes({ status, userId })
  res.status(200).json({ data: user })
})
