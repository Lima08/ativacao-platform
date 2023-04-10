import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { User } from 'models/User'
import { REQUEST_METHODS } from 'constants/http/requestMethods'

const userRepository = User.of(prisma)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string

  if (!id)
    return res.status(404).json({
      message: `User with id: ${id} not found.`,
      name: 'User not found'
    })

  switch (req.method) {
    case REQUEST_METHODS.GET:
      try {
        const user = await userRepository.getOneBy({ id })
        res.status(200).json(user)
      } catch (error) {
        res.status(404).json(error)
      }
      break

    case REQUEST_METHODS.PUT:
      try {
        const { name, email, password, companyId, imageUrl } = req.body
        const updatedUser = await userRepository.update(id, {
          name,
          email,
          password,
          companyId,
          imageUrl
        })
        res.status(200).json(updatedUser)
      } catch (error) {
        res.status(404).json(error)
      }
      break

    case REQUEST_METHODS.DELETE:
      try {
        await userRepository.delete(id)
        res.status(204).end()
      } catch (error) {
        res.status(404).json(error)
      }
      break

    default:
      res.status(400).send('Invalid method')
      break
  }
}
