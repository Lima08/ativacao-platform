import { getAllAnalyzes } from 'useCases/analyzes'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const userId = '4181b23f-c4a8-47d1-99c8-2db883d84eb3'
    const { status } = req.body

    const user = await getAllAnalyzes({ status, userId })
    return res.status(200).json({ data: user })
  }
}
