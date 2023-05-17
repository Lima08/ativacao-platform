import { createTraining } from 'useCases/trainings'

// TODO: Colocar middleware de validação
export default async function handler(req: any, res: any) {
  const { name, description, mediaIds } = req.body

  if (req.method === 'POST') {
    const createdTraining = await createTraining({
      name,
      description,
      userId: '4181b23f-c4a8-47d1-99c8-2db883d84eb3',
      companyId: '5c9e558a-1eb8-44d4-9abb-693c65ee57c4',
      mediaIds
    })
    return res.status(201).json({ data: createdTraining })
  }
}
