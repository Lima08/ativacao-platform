import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import user from 'schemaValidation/user'
import { getUserById, deleteUser, updateUser } from 'useCases/users'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  // const {  role: requestRole, userId } = req.user!

  if (req.method === REQUEST_METHODS.GET) {
    const user = await getUserById(id)
    return res.status(HTTP_STATUS.OK).json({ data: user })
  }

  if (req.method === REQUEST_METHODS.PUT) {
    const { name, password, imageUrl, role, isActive } = req.body
   
    try {
      const updatedCampaign = await updateUser(id, {
        name,
        password,
        imageUrl,
        role,
        isActive
      })

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
