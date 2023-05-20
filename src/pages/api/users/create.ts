import type { NextApiRequest, NextApiResponse } from 'next'

import CustomError from 'constants/errors/CustoError'
import { createUser } from 'useCases/users'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name, companyId } = req.body
  //  Buscar company. Ter mensagem de erro caso não tenha o companyId
  // validar campos de entrada e ja retornar erro caso algum venha errado
  // Ver se coloca minimo de senha aqui ou no front - se n colocar aqui criar tarefa para fazer

  try {
    await createUser({
      email,
      password,
      companyId,
      name
    })

    return res.status(201).end()
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ error })
    }
    return res.status(500).json({ error })
  }
}
