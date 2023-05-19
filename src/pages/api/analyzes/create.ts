import { createAnalysis } from 'useCases/analyzes'

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const userId = '4181b23f-c4a8-47d1-99c8-2db883d84eb3'
    const { title, bucketUrl } = req.body

    const createdTraining = await createAnalysis({
      title,
      userId,
      bucketUrl
    })
    return res.status(201).json({ data: createdTraining })
  }
}
