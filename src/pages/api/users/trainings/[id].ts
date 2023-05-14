import handler from 'handler'
import { updateStatus } from 'useCases/users/userTrainings'

export default handler.put(async (req, res) => {
  const { status } = req.body
  const id = req.query.id as string

  const updatedTraining = await updateStatus(id, {
    status
  })

  return res.status(200).json({ data: updatedTraining })
})
