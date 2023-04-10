// import { getS3Client } from '../lib/s3'
// import multerS3 from 'multer-s3'
// import dotenv from 'dotenv'
// import { randomToken } from 'functions/randomToken'
import multer, { memoryStorage } from 'multer'

// dotenv.config()

const storage = memoryStorage()
export const upload = multer({
  storage
  // storage: multerS3({
  //   s3: getS3Client(),
  //   bucket: process.env.AWS_BUCKET_NAME!,
  //   contentType: multerS3.AUTO_CONTENT_TYPE,
  //   key: (req, file, cb) => {
  //     const filename = `${randomToken()}.${file.originalname}`
  //     cb(null, filename)
  //   }
  // })
})
