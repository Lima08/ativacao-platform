import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { loginUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method == REQUEST_METHODS.POST) {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Email or password invalid' })
    }

    try {
      const loginData = await loginUser({ email, password })
      return res.status(HTTP_STATUS.OK).json({
        data: {
          token: loginData.token,
          user: loginData.user,
          company: loginData.company
        }
      })
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
