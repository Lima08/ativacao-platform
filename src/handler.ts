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
  req.companyId = 'dfda4d4a-df82-47c3-bb5e-391cc4589ea1'
  req.userId = '30eb9932-1235-4352-96f5-c1871f9cdf6d'

  next()
})
