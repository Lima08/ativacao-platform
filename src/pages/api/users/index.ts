import { NextApiRequestWithMulter, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/http/requestMethods'
import { createUser, getUsers } from 'useCases/users'
import { uploadS3Multer } from 'middlewares/upload'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequestWithMulter,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      try {
        //@ts-ignore
        uploadS3Multer(req, res, async (error) => {
          if (error) {
            return res.status(400).json(error)
          }

          const imageUrl = req.file?.location
          const { email, password, companyId, name } = req.body

          const createdUser = await createUser({
            email,
            password,
            companyId,
            name,
            imageUrl
          })

          res.status(201).json({ data: createdUser })
        })
      } catch (error) {
        res.status(500).send('Error creating user')
      }

      break

    case REQUEST_METHODS.GET:
      try {
        const allUsers = await getUsers()
        res.status(200).json({ data: allUsers })
      } catch (error) {
        res.status(500).send('Error getting users')
      }
      break

    default:
      res.status(400).send('Invalid method')
      break
  }
}
