import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import {
  updateTraining,
  deleteTraining,
  getTrainingById
} from 'useCases/trainings'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string

  if (req.method === REQUEST_METHODS.GET) {
    try {
      const training = await getTrainingById(id)
      return res.status(HTTP_STATUS.OK).json({ data: training })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }
  if (req.method === REQUEST_METHODS.PUT) {
    const { name, description, mediaIds, active } = req.body

    try {
      const updatedTraining = await updateTraining(id, {
        name,
        description,
        mediaIds,
        active
      })
      return res.status(HTTP_STATUS.OK).json({ data: updatedTraining })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  if (req.method === REQUEST_METHODS.DELETE) {
    try {
      await deleteTraining(id)
      return res.status(HTTP_STATUS.NO_CONTENT).end()
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
