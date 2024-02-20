import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import createProcessSchema from 'schemasValidation/process/createProcessSchema'
import { createProcess } from 'useCases/processes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const { companyId, userId, role } = req.user!

  if (role < ROLES.COMPANY_ADMIN) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }

  if (req.method === REQUEST_METHODS.POST) {
    const { title, templateProcessId, documentIds } = req.body
    const { error } = createProcessSchema.validate({
      companyId,
      userId,
      title,
      templateProcessId,
      documentIds
    })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: error.details[0].message })
    }

    try {
      const createdProcess = await createProcess({
        title,
        templateProcessId,
        companyId,
        userId,
        documentIds
      })

      return res.status(HTTP_STATUS.CREATED).json({ data: createdProcess })
    } catch (error: any) {
      return res
        .status(error.code || HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
