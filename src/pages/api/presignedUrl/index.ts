import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import s3Service from 'services/s3Service'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method == REQUEST_METHODS.POST) {
    const { bucket, key } = req.body
    const s3Instance = s3Service.getInstance()

    try {
      const presignedUrl = await s3Instance.createPresignedUrl({ bucket, key })
      return res.status(HTTP_STATUS.OK).json({ data: presignedUrl })
    } catch (error: any) {
      return res
        .status(error.code)
        .json({ message: error.message, meta: error.meta })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}
