import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import {
  getTemplateProcessById,
  updateTemplateProcessTitle,
  deleteTemplateProcess
} from 'useCases/templateProcess'

async function handler(req: any, res: any) {
  const id = req.query.id as string
  const { role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
  }

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const templateProcess = await getTemplateProcessById(id)
      return res.status(HTTP_STATUS.OK).json({ data: templateProcess })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { title } = req.body
    if (role < ROLES.SYSTEM_ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
    }

    try {
      const updatedTemplateProcess = await updateTemplateProcessTitle(id, title)

      return res.status(HTTP_STATUS.OK).json({ data: updatedTemplateProcess })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    if (role < ROLES.SYSTEM_ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Forbidden' })
    }

    await deleteTemplateProcess(id)
    return res.status(HTTP_STATUS.NO_CONTENT).end()
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
