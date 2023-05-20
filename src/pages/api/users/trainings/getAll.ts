import { getAllBy } from 'useCases/users/userTrainings'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const userId = '4181b23f-c4a8-47d1-99c8-2db883d84eb3'

    const userTrainings = await getAllBy({ userId })
    return res.status(200).json({ data: userTrainings })
  }
}
