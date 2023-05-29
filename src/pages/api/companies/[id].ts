import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
import { REQUEST_METHODS } from 'constants/enums/eRequestMethods'
import { authCheck } from 'middlewares/authCheck'
import updateCompanySchema from 'schemasValidation/company/updateCompanySchema'
import { getCompanyById, updateCompany } from 'useCases/companies'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string

  if (req.method === REQUEST_METHODS.GET) {
    const Company = await getCompanyById(id)
    return res.status(HTTP_STATUS.OK).json({ data: Company })
  }

  if (req.method === REQUEST_METHODS.PUT) {
    const { name, slug, imageUrl } = req.body
    const { error } = updateCompanySchema.validate({ name, slug, imageUrl })

    if (error) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: error.details[0].message })
    }

    try {
      const updatedCampaign = await updateCompany(id, { name, slug, imageUrl })

      return res.status(HTTP_STATUS.OK).json({ data: updatedCampaign })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
