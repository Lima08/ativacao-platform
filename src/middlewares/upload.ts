import dotenv from 'dotenv'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { getS3Client } from '../lib/s3'
import { randomToken } from 'functions/randomToken'

dotenv.config()



const upload = multer({
  storage: multerS3({
    s3: getS3Client(),
    bucket: (req, file, cb) => {
      let bucketName: string

      const type = file.mimetype.split('/')[0]
      if (['image', 'video'].includes(type)) {
        bucketName = process.env.AWS_BUCKET_MEDIA!
        // @ts-ignore
        req.type = type
      }

      if (type === 'application' && file.mimetype.endsWith('sheet')) {
        bucketName = process.env.AWS_BUCKET_DOC!
        // @ts-ignore
        req.type = 'document'
      }
        // @ts-ignore
      cb(null, bucketName)
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const filename = `${randomToken()}.${file.originalname}`
      cb(null, filename)
    }
  })
})
export const uploadS3Multer = upload.single('file')
