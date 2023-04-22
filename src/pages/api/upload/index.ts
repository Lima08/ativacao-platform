import handler from 'handler'
import { uploadS3Multer } from 'middlewares/upload'
import { createMedia } from 'useCases/media'

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler.use(uploadS3Multer).post(async (req, res) => {
  const url = req.file.location
  const createdFile = await createMedia({ type: req.type, url })

  res.status(201).json({ data: { createdFile } })
})
