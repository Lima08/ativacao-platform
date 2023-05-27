import type { NextApiRequestCustom, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs'
import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { IUserModifier } from 'interfaces/entities/user'
import { authCheck } from 'middlewares/authCheck'
import updateSchema from 'schemaValidation/userSchemas/updateSchema'
import { getUserById, deleteUser, updateUser } from 'useCases/users'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string

  if (req.method === REQUEST_METHODS.GET) {
    const user = await getUserById(id)
    return res.status(HTTP_STATUS.OK).json({ data: user })
  }

  if (req.method === REQUEST_METHODS.PUT) {
    const { name, password, imageUrl, role, isActive } = req.body
    const { error } = updateSchema.validate({
      name,
      password,
      imageUrl,
      role,
      isActive
    })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.details[0].message })
    }

    const updatedUserData: IUserModifier = {
      name,
      imageUrl,
      role,
      isActive
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updatedUserData.password = hashedPassword
    }

    try {
      const updatedCampaign = await updateUser(id, updatedUserData)

      return res.status(HTTP_STATUS.OK).json({ data: updatedCampaign })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    await deleteUser(id)
    return res.status(HTTP_STATUS.NO_CONTENT).end()
  }
  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
