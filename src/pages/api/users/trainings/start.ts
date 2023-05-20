import { start } from 'useCases/users/userTrainings'

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { trainingId } = req.body
    const userId = '4181b23f-c4a8-47d1-99c8-2db883d84eb3'

    const createdTraining = await start({
      trainingId,
      userId
    })
    return res.status(201).json({ data: createdTraining })
  }
}
