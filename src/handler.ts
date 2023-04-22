import { NextApiRequestCustom, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequestCustom, NextApiResponse>({
  onError: (error, _req, res) => {
    const statusCode = error.code || 500
    res.status(statusCode).json({ message: error.message, meta: error.meta })
  },
  onNoMatch: (_req, res) => {
    res.status(404).json({ error: { message: 'Page is not found' } })
  }
}).use((req, res, next) => {
  // TEMP: This will come from jwt token
  req.companyId = '6d3482b1-b989-4db9-ac37-0668341e0ed4'
  req.userId = 'c8a22840-3351-4249-bcc9-eef74487a039'

  next()
})
