import { deleteMedia } from 'useCases/media'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === 'DELETE') {
    await deleteMedia(id)
    return res.status(204).end()
  }
}
