import { updateStatus } from 'useCases/users/userTrainings'

// TODO: Em desenvolvimento
export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === 'PUT') {
    const { status } = req.body

    const updatedTraining = await updateStatus(id, {
      status
    })

    return res.status(200).json({ data: updatedTraining })
  }
}
