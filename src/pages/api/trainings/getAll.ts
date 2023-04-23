import handler from 'handler'
import { getAllTrainings } from 'useCases/trainings'

export default handler.get(async (req, res) => {
  const companyId = req.companyId!

  const user = await getAllTrainings({ companyId })
  res.status(200).json({ data: user })
})
