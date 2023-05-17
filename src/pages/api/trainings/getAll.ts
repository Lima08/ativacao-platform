import { getAllTrainings } from 'useCases/trainings'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const companyId = '5c9e558a-1eb8-44d4-9abb-693c65ee57c4'

    const trainings = await getAllTrainings({ companyId })
    return res.status(200).json({ data: trainings })
  }
}
