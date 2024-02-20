import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import { updateOrder, getOrderById, deleteOrder } from 'useCases/Order'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: 'Unauthorized' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const Order = await getOrderById(id)
      return res.status(HttpStatusCode.Ok).json({ data: Order })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    if (role < ROLES.SYSTEM_ADMIN) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: 'Unauthorized' })
    }
    const { message, status, title } = req.body
    try {
      const updatedOrder = await updateOrder(id, {
        message,
        status,
        title
      })

      return res.status(HttpStatusCode.Ok).json({ data: updatedOrder })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    if (role < ROLES.SYSTEM_ADMIN) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: 'Unauthorized' })
    }
    try {
      await deleteOrder(id)
      return res.status(HttpStatusCode.NoContent).end()
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
