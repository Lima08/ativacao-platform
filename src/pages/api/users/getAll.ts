import handler from 'handler'
import { getUsers } from 'useCases/users'

export default handler.get(async (req, res) => {
  const companyId = req.companyId!

  const user = await getUsers({ companyId })
  return res.status(200).json({ data: user })
})
