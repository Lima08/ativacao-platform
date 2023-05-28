import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import { getAnalysisBy } from 'useCases/analyzes'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  if (req.method === REQUEST_METHODS.GET) {
    const exampleId = process.env.EXAMPLE_ANALYSIS_ID

    const exampleAnalysis = await getAnalysisBy(String(exampleId))
    return res.status(HTTP_STATUS.OK).json({ data: exampleAnalysis })
  }
  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}
export default authCheck(handler)
