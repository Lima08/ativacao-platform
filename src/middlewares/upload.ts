import dotenv from 'dotenv'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { getS3Client } from '../lib/s3'
import { randomToken } from 'functions/randomToken'

dotenv.config()

const upload = multer({
  storage: multerS3({
    s3: getS3Client(),
    bucket: process.env.AWS_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const filename = `${randomToken()}.${file.originalname}`
      cb(null, filename)
    }
  })
})
export const uploadS3Multer = upload.single('file')

// const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
// const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
// const buffer = await sharp(req.file.buffer).resize({ width: 1080, height: 1920, fit: 'contain' }).toBuffer()
