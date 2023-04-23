import dotenv from 'dotenv'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { getS3Client } from '../lib/s3'
import { randomToken } from 'functions/randomToken'

dotenv.config()

function getBucketName(type: string): string {
  switch (type) {
    case 'image':
      return process.env.AWS_BUCKET_IMAGE!
    case 'video':
      return process.env.AWS_BUCKET_VIDEO!
    case 'document':
      return process.env.AWS_BUCKET_DOC!
    default:
      throw new Error(`Tipo de arquivo inválido: ${type}`)
  }
}

const upload = multer({
  storage: multerS3({
    s3: getS3Client(),
    bucket: (req, file, cb) => {
      const type = file.mimetype.split('/')[0]
      // @ts-ignore
      req.type = type
      const bucketName = getBucketName(type)
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
