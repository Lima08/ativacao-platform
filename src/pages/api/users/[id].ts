import handler from 'handler'
import { getUserById, deleteUser } from 'useCases/users'

export default handler
  .get(async (req, res) => {
    const id = req.query.id as string

    const user = await getUserById(id)
    res.status(200).json({ data: user })
  })
  .delete(async (req, res) => {
    const id = req.query.id as string

    await deleteUser(id)
    res.status(204).end()
  })
