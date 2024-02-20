import { HttpStatusCode } from 'axios'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import {
  getTemplateOrderById,
  updateTemplateOrderTitle,
  deleteTemplateOrder
} from 'useCases/templateOrder'

async function handler(req: any, res: any) {
  const id = req.query.id as string
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HttpStatusCode.Forbidden).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const templateOrder = await getTemplateOrderById(id)
      return res.status(HttpStatusCode.Ok).json({ data: templateOrder })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { title } = req.body
    if (role < ROLES.SYSTEM_ADMIN) {
      return res.status(HttpStatusCode.Forbidden).json({ message: 'Forbidden' })
    }

    try {
      const updatedTemplateOrder = await updateTemplateOrderTitle(id, title)

      return res.status(HttpStatusCode.Ok).json({ data: updatedTemplateOrder })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    if (role < ROLES.SYSTEM_ADMIN) {
      return res.status(HttpStatusCode.Forbidden).json({ message: 'Forbidden' })
    }

    await deleteTemplateOrder(id)
    return res.status(HttpStatusCode.NoContent).end()
  }

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
