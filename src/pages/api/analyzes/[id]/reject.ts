import handler from 'handler'
import { rejected } from 'useCases/analyzes'

export default handler.put(async (req, res) => {
  const id = req.query.id as string

  const data = await rejected(id)
  return res.status(200).json({ data })
})
