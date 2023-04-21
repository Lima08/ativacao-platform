import { REQUEST_METHODS } from 'constants/http/requestMethods'
import { NextApiRequest, NextApiResponse } from 'next'
import files from 'useCases/files'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  if (!id)
    return res.status(404).json({
      message: `Image with id: ${id} not found.`,
      name: 'Image not found'
    })

  switch (req.method) {
    case REQUEST_METHODS.DELETE:
      try {
        await files.deleteOne('image', id)
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
