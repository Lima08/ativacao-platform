import handler from 'handler'
import { getAllBy } from 'useCases/users/userTrainings'

export default handler.get(async (req, res) => {
  const userId = req.userId!

  const userTrainings = await getAllBy({ userId })
  res.status(200).json({ data: userTrainings })
})
