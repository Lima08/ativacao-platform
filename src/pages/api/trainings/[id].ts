import {
  updateTraining,
  deleteTraining,
  getTrainingById
} from 'useCases/trainings'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string
  if (req.method === 'GET') {
    const training = await getTrainingById(id)
    return res.status(200).json({ data: training })
  }
  if (req.method === 'PUT') {
    const { name, description, mediaIds, active } = req.body
    const updatedTraining = await updateTraining(id, {
      name,
      description,
      mediaIds,
      active
    })

    return res.status(200).json({ data: updatedTraining })
  }
  if (req.method === 'DELETE') {
    await deleteTraining(id)
    return res.status(204).end()
  }
}
