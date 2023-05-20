import type { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs'
import loginSchema from 'schemaValidation/loginSchema'
import { createUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name, companyId } = req.body
  const { error } = loginSchema.validate({ email, password, name, companyId })
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  if (!hashedPassword) {
    return res.status(200).json({ hashedPassword })
  }

  try {
    await createUser({
      email,
      password: hashedPassword,
      companyId,
      name
    })

    return res.status(201).end()
  } catch (error: any) {
    return res.status(error.code).json({ error: { message: error.message } })
  }
}
