import { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { getAllTrainings } from 'useCases/trainings'
async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const { companyId } = req.user!

    const trainings = await getAllTrainings({ companyId })
    return res.status(200).json({ data: trainings })
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}
export default authCheck(handler)
