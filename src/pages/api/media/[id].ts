import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { deleteMedia } from 'useCases/media'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === REQUEST_METHODS.DELETE) {
    await deleteMedia(id)
    return res.status(HttpStatusCode.NoContent).end()
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}
