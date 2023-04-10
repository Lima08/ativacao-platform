import s3Service from 'services/s3Service'
import { User } from 'models/User'
import { prisma } from 'lib/prisma'
import { randomToken } from 'functions/randomToken'
import { NextApiRequest, NextApiResponse } from 'next'
import { upload } from 'utils/upload'
import dotenv from 'dotenv'

dotenv.config()
const userRepository = User.of(prisma)

// TODO: Tipar
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  // const { /* name, email, password, companyId, */ file } = req.body // TODO: TRocar nome imageUrl para???
  // console.log('🚀 ~ file: index.ts:14 ~ createUser ~ file:', file)

  // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  const uploadHandler = upload.single('file')
  uploadHandler(req, res, async (err) => {
    if (err) {
      console.log('Error', err)
      return res.status(500).json({ message: 'Error uploading file' })
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${randomToken()}.${req.file.originalname}`,
      body: req.file.buffer,
      ContentType: req.file.mimetype
    }

    const result = await s3Service.getInstance().putObject(params)
    res.status(200).json({ result })
  })
}
// req.file.originalName = usar para o banco
// const user = await userRepository.create({
//   name,
//   email,
//   password,
//   companyId,
//   imageUrl:
// })
// res.status(200).json({ fileUrl: imageUrl })
// return user
/* 
  ver uso da lib sharp apra fazer iresizeing das imagens - vide doc
  - ter uma diferença de post para perfil e company de post para treinamento
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
const buffer = await sharp(req.file.buffer).resize({ width: 1080, height: 1920, fit: 'contain' }).toBuffer()


// Set the parameters


*/
// }

export { createUser }
