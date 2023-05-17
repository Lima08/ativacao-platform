import { done } from 'useCases/analyzes'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === 'PUT') {
    const biUrl = req.body.biUrl as string

    const data = await done(id, { biUrl })
    return res.status(200).json({ data })
  }
}
