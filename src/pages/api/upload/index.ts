import handler from 'handler'
import { uploadS3Multer } from 'middlewares/upload'
import { createMedia } from 'useCases/media'

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler.use(uploadS3Multer).post(async (req, res) => {
  const filesList = []

  if (!req.files.length) {
    return res.status(400).json({ error: 'No files uploaded.' })
  }

  for (const file of req.files) {
    const key = file.key
    const url = file.location
    const type = file.contentType.split('/')[0]

    if (type === 'application') {
      return res.status(201).json({
        data: {
          type: 'document',
          key,
          url,
          bucket: file.bucket,
          name: file.originalname
        }
      })
    }

    const createdFile = await createMedia({ type, url, key })
    filesList.push(createdFile)
  }

  return res.status(201).json({ data: filesList })
})
