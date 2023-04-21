import { NextApiRequestWithMulter, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequestWithMulter, NextApiResponse>({
  onError: (error, _req, res, next) => {
    res.status(500).json({ error })
  },
  onNoMatch: (_req, res) => {
    res.status(404).json({ error: { message: 'Page is not found' } })
  }
})
