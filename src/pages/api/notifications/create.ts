import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { ROLES } from 'constants/enums/eRoles'
import { authCheck } from 'middlewares/authCheck'
import createSchema from 'schemasValidation/notification/createSchema '
import { createNotification } from 'useCases/notifications'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.POST) {
    const { companyId, userId, role } = req.user!

    if (role < ROLES.COMPANY_ADMIN) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' })
    }

    const { title, description, imageUrl, link } = req.body
    const { error } = createSchema.validate({
      title,
      description,
      companyId,
      userId,
      imageUrl,
      link
    })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: error.details[0].message })
    }

    try {
      const createdNotification = await createNotification({
        title,
        description,
        companyId,
        userId,
        imageUrl,
        link
      })

      return res.status(HTTP_STATUS.CREATED).json({ data: createdNotification })
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
