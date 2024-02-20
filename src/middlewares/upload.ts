import { MAX_FILE_SIZE } from 'constants/index'
import dotenv from 'dotenv'
import { randomToken } from 'functions/randomToken'
import multer from 'multer'
import multerS3 from 'multer-s3'

import { getS3Client } from '../lib/s3'

dotenv.config()

const upload = multer({
  storage: multerS3({
    s3: getS3Client(),
    bucket: (_req, _files, cb) => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_MEDIA!

      cb(null, bucketName)
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const filename = `${randomToken()}.${file.originalname}`
      cb(null, filename)
    }
  }),
  limits: {
    fileSize: MAX_FILE_SIZE // 500MB
  }
})
export const uploadS3Multer = upload.array('files', 10)
