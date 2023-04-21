import { createUser } from 'useCases/users'
import { uploadS3Multer } from 'middlewares/upload'
import handler from '../../../handler'

export const config = {
  api: {
    bodyParser: false
  }
}
const COMPANY_ID = '6d3482b1-b989-4db9-ac37-0668341e0ed4' // TEMP: This will come from jwt token

export default handler.use(uploadS3Multer).post(async (req, res) => {
  const imageUrl = req.file.location
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
