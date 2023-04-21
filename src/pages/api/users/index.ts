import { NextApiRequestWithMulter, NextApiResponse } from 'next'
import { createUser, getUsers } from 'useCases/users'
import { uploadS3Multer } from 'middlewares/upload'
import { REQUEST_METHODS } from 'constants/enums/requestMethods'

export const config = {
  api: {
    bodyParser: false
  }
}
const COMPANY_ID = '6d3482b1-b989-4db9-ac37-0668341e0ed4'

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
            res.status(500).json({ error })
          }

          const imageUrl = req.file?.location
          const { email, password, name } = req.body

          const createdUser = await createUser({
            email,
            password,
            companyId: COMPANY_ID,
            name,
            imageUrl
          })

          res.status(201).json({ data: createdUser })
        })
      } catch (error) {
        res.status(500).json({ error })
      }

      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
