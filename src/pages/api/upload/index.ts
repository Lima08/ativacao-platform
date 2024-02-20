import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import handler from 'handler'
import { uploadS3Multer } from 'middlewares/upload'
import { createMedia } from 'useCases/media'

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler.use(uploadS3Multer).post(async (req, res) => {
  const filesList: any = []

  if (!req.files.length) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'No files uploaded.' })
  }

  for (const file of req.files) {
    const key = file.key
    const url = file.location
    const type = file.contentType.split('/')[0]

    if (type === 'application') {
      return res.status(HTTP_STATUS.CREATED).json({
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

  return res.status(HTTP_STATUS.OK).json({ data: filesList })
})
