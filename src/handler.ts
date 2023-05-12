import { NextApiRequestCustom, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequestCustom, NextApiResponse>({
  onError: (error, _req, res) => {
    const statusCode = error.code || 500
    res
      .status(statusCode)
      .json({ error: { message: error.message, meta: error.meta } })
  },
  onNoMatch: (_req, res) => {
    res.status(404).json({ error: { message: 'Page is not found' } })
  }
}).use((req, res, next) => {
  // TEMP: This will come from jwt token
  req.companyId = '5c9e558a-1eb8-44d4-9abb-693c65ee57c4'
  req.userId = '4181b23f-c4a8-47d1-99c8-2db883d84eb3'

  next()
})
