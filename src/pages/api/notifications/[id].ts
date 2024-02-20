import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import {
  updateNotification,
  deleteNotification,
  getNotificationById
} from 'useCases/notifications'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  if (req.method === REQUEST_METHODS.GET) {
    try {
      const notification = await getNotificationById(id)
      return res.status(HTTP_STATUS.OK).json({ data: notification })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { title, description, imageUrl, link } = req.body
    try {
      const updatedNotification = await updateNotification(id, {
        title,
        description,
        imageUrl,
        link
      })

      return res.status(HTTP_STATUS.OK).json({ data: updatedNotification })
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteNotification(id)
      return res.status(HTTP_STATUS.NO_CONTENT).end()
    } catch (error: any) {
      return res.status(error.code).json({ message: error.message })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ message: 'Method not allowed' })
}

export default authCheck(handler)
