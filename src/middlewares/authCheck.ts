import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import jwt, { TokenExpiredError } from 'jsonwebtoken'

export const authCheck =
  (handler: (req: NextApiRequestCustom, res: NextApiResponse) => void) =>
  async (req: NextApiRequestCustom, res: NextApiResponse) => {
    if (!req.headers.authorization) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'No token in request headers' })
    }

    const token = req.headers.authorization.split(' ')[1]
    if (token == null) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)

      // @ts-ignore
      req.user = decoded.user as NextApiRequestCustom['user']
      return handler(req, res)
    } catch (err) {
      let message = 'Token verification failed'
      if (err instanceof TokenExpiredError) {
        message = err.message
      }

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message })
    }
  }
