import { NextApiRequest, NextApiResponse } from 'next'

import { loginUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(401)
      .json({ error: { message: 'Email or password invalid' } })
  }

  try {
    const token = await loginUser({ email, password })
    return res.status(200).json({ token })
  } catch (error: any) {
    return res.status(error.code).json({ error: { message: error.message } })
  }
}
