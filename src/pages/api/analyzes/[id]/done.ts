import handler from 'handler'
import { done } from 'useCases/analyzes'

export default handler.put(async (req, res) => {
  const id = req.query.id as string
  const biUrl = req.body.biUrl as string

  const data = await done(id, { biUrl })
  return res.status(200).json({ data })
})
