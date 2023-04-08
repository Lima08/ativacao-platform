import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../databases/prisma'
import { Users } from 'models/Users'
import { REQUEST_METHODS } from 'constants/requestMethods'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userRepository = Users.of(prisma)

  switch (req.method) {
    case REQUEST_METHODS.POST:
      const { name, email, password, companyId, imageUrl } = req.body
      const user = await userRepository.create({
        name,
        email,
        password,
        companyId,
        imageUrl
      })
      res.status(201).json(user)
      break

    case REQUEST_METHODS.GET:
      try {
        const users = await userRepository.getAll()
        res.status(200).json(users)
      } catch (error) {
        res.status(404).json(error)
      }
      break

    default:
      res.status(400).send('Invalid method')
      break
  }
}
