import handler from 'handler'
import { uploadS3Multer } from 'middlewares/upload'
import { createAnalysis } from 'useCases/analyzes'

export const config = {
  api: {
    bodyParser: false
  }
}

// TODO: Colocar middleware de validação
export default handler.use(uploadS3Multer).post(async (req, res) => {
  const documentUrl = req.files[0].location
  const userId = req.userId!
  const { title } = req.body

  const createdTraining = await createAnalysis({
    title,
    userId,
    bucketUrl: documentUrl
  })
  return res.status(201).json({ data: createdTraining })
})
