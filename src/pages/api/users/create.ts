import handler from 'handler'
import { createUser } from 'useCases/users'
import { uploadS3Multer } from 'middlewares/upload'

export const config = {
  api: {
    bodyParser: false
  }
}

// TODO: Colocar middleware de validação
export default handler.use(uploadS3Multer).post(async (req, res) => {
  const imageUrl = req.files[0].location
  const { email, password, name } = req.body
  const companyId = req.companyId!

  const createdUser = await createUser({
    email,
    password,
    companyId,
    name,
    imageUrl
  })

  res.status(201).json({ data: createdUser })
})
