import type { NextApiRequestCustom, NextApiResponse } from 'next'

import { authCheck } from 'middlewares/authCheck'
import user from 'schemaValidation/user'
import { getUserById, deleteUser, updateUser } from 'useCases/users'

async function handler(req: NextApiRequestCustom, res: NextApiResponse) {
  const id = req.query.id as string
  if (req.method === 'GET') {
    const user = await getUserById(id)
    return res.status(200).json({ data: user })
  }

  if (req.method === 'PUT') {
    const { name, password, imageUrl, role, isActive } = req.body
    const { error } = user.updateSchema.validate({
      name,
      password,
      imageUrl,
      role,
      isActive
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    //  TODO: Adicionar joi
    try {
      const updatedCampaign = await updateUser(id, {
        name,
        password,
        imageUrl,
        role,
        isActive
      })

      return res.status(200).json({ data: updatedCampaign })
    } catch (error: any) {
      return res.status(error.code).json({ error: { message: error.message } })
    }
  }

  if (req.method === 'DELETE') {
    await deleteUser(id)
    return res.status(204).end()
  }
  res.status(405).json({ error: { message: 'Method not allowed' } })
}

export default authCheck(handler)
