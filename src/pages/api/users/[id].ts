import handler from 'handler'
import { getUserById } from 'useCases/users'

export default handler.get(async (req, res) => {
  const id = req.query.id as string

  if (!id)
    return res.status(404).json({
      error: {
        message: `User with id ${id} not found.`,
        name: 'User not found'
      }
    })

  const user = await getUserById(id)
  res.status(200).json({ data: user })
})
