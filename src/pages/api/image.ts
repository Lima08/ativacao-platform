import { createUser } from 'controllers/users'
import { NextApiRequest, NextApiResponse } from 'next'
// import { upload } from 'utils/upload'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createUser(req, res)
  // const uploadHandler = upload.single('file')

  // uploadHandler(req, res, (err) => {
  //   if (err) {
  //     console.log('Error', err)
  //     return res.status(500).json({ message: 'Error uploading file' })
  //   }

  // res
  //   .status(200)
  //   .json({ fileUrl: req.file.location, nama: req.file.originalname })
  // })
}

export const config = {
  api: {
    bodyParser: false
  }
}
