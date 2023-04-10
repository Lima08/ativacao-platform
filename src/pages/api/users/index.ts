import { NextApiRequest, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/http/requestMethods'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      // mudar para arquivo de imagem (formData)
      const { name, email, password, companyId, imageUrl } = req.body

      // res.status(201).json(user)
      break

    case REQUEST_METHODS.GET:
      try {
        // res.status(200).json(users)
      } catch (error) {
        res.status(404).json(error)
      }
      break

    default:
      res.status(400).send('Invalid method')
      break
  }
}
