import handler from 'handler'
import { start } from 'useCases/users/userTrainings'

export default handler.post(async (req, res) => {
  const { trainingId } = req.body
  const userId = req.userId!

  const createdTraining = await start({
    trainingId,
    userId
  })
  res.status(201).json({ data: createdTraining })
})
