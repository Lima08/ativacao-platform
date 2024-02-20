import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { deleteDocument } from 'useCases/documents'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string

  if (req.method === REQUEST_METHODS.DELETE) {
    await deleteDocument(id)
    return res.status(HTTP_STATUS.NO_CONTENT).end()
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}
