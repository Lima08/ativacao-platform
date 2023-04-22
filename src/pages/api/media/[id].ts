import handler from 'handler'
import { deleteMedia } from 'useCases/media'

export default handler.delete(async (req, res) => {
  const id = req.query.id as string

  await deleteMedia(id)
  res.status(204).end()
})
