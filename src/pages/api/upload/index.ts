import { NextApiRequestCustom, NextApiResponse } from 'next'
import files from 'useCases/files'
import { uploadS3Multer } from 'middlewares/upload'
import { REQUEST_METHODS } from 'constants/enums/requestMethods'



export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      try {
        //@ts-ignore
        uploadS3Multer(req, res, async (error) => {
          if (error) {
            res.status(500).json({ error })
            return
          }

          const url = req.file.location
          const type = req.file.mimetype
          const { trainingId, campaignId } = req.body

          const createdUpload = await files.create(type, {
            trainingId,
            url,
            campaignId
          })

          res.status(201).json({ data: createdUpload })
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
