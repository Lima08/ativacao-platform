import { NextApiRequestCustom, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequestCustom, NextApiResponse>()
