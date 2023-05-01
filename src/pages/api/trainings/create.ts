import handler from 'handler'
import { createTraining } from 'useCases/trainings'

// TODO: Colocar middleware de validação
export default handler.post(async (req, res) => {
  const { name, description, mediaIds } = req.body
  const companyId = req.companyId!
  const userId = req.userId!

  const createdTraining = await createTraining({
    name,
    description,
    userId,
    companyId,
    mediaIds
  })
  res.status(201).json({ data: createdTraining })
})
