import handler from 'handler'
import { toggleActive } from 'useCases/trainings'

export default handler.put(async (req, res) => {
  const id = req.query.id as string

  const updatedTraining = await toggleActive(id)

  return res.status(200).json({ data: updatedTraining })
})
