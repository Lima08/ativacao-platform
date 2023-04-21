import { NextApiRequest, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/enums/requestMethods'
import { deleteUser, getUserById, getUsers, updateUser } from 'useCases/users'
import { IUserCreated } from 'interfaces/entities/user'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const companyId = req.query.companyId as string

  if (!companyId)
    return res.status(404).json({
      error: {
        message: `Users with companyId ${companyId} not found.`,
        name: 'Users not found'
      }
    })

  switch (req.method) {
    case REQUEST_METHODS.GET:
      const { id } = req.body
      let response: IUserCreated | IUserCreated[]
      
      console.log('🚀 ~ file: [companyId].ts:11 ~ companyId:', companyId)
      console.log('🚀 ~ file: [companyId].ts:24 ~ req.body:', req.body)
      console.log('🚀 ~ file: [companyId].ts:23 ~ id:', id)

      try {
        if (id) {
          const user = await getUserById(id)
          response = user
        } else {
          const allUsers = await getUsers({ companyId })
          response = allUsers
        }

        res.status(200).json({ data: response })
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
