import type { NextApiRequestCustom, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import loginSchema from 'schemasValidation/user/loginSchema'
import { createUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse
) {
  if (req.method === REQUEST_METHODS.POST) {
    const { email, password, name, companyId } = req.body
    const { error } = loginSchema.validate({ email, password, name, companyId })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: error.details[0].message })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      await createUser({
        email,
        password: hashedPassword,
        companyId,
        name
      })

      return res.status(HTTP_STATUS.CREATED).end()
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message, meta: error.meta })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({message: 'Method not allowed' })
}
