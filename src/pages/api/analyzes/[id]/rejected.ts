import { rejected } from 'useCases/analyzes'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === 'PUT') {
    const data = await rejected(id)
    return res.status(200).json({ data })
  }
}
