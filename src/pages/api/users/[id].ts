import { NextApiRequest, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/http/requestMethods'
import { deleteUser, getUserById, updateUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  if (!id)
    return res.status(404).json({
      error: {
        message: `User with id ${id} not found.`,
        name: 'User not found'
      }
    })

  switch (req.method) {
    case REQUEST_METHODS.GET:
      try {
        const user = await getUserById(id)
        res.status(200).json({ data: user })
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    case REQUEST_METHODS.PUT:
      const { name, password, imageUrl } = req.body

      try {
        const updatedUser = await updateUser(id, {
          name,
          password,
          imageUrl
        })
        res.status(200).json({ data: updatedUser })
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    case REQUEST_METHODS.DELETE:
      try {
        await deleteUser(id)
        res.status(204).end()
      } catch (error) {
        res.status(404).json({ error })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
