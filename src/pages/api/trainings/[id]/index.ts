import handler from 'handler'
import {
  updateTraining,
  deleteTraining,
  getTrainingById
} from 'useCases/trainings'

export default handler
  .get(async (req, res) => {
    const id = req.query.id as string

    const training = await getTrainingById(id)
    res.status(200).json({ data: training })
  })
  .put(async (req, res) => {
    const { name, description, mediaIds, active } = req.body
    const id = req.query.id as string

    const updatedTraining = await updateTraining(id, {
      name,
      description,
      mediaIds,
      active
    })

    res.status(200).json({ data: updatedTraining })
  })
  .delete(async (req, res) => {
    const id = req.query.id as string

    await deleteTraining(id)
    res.status(204).end()
  })
