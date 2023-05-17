import { getUserById, deleteUser } from 'useCases/users'

export default async function handler(req: any, res: any) {
  const id = req.query.id as string
  if (req.method === 'GET') {
    const user = await getUserById(id)
    return res.status(200).json({ data: user })
  }

  if (req.method === 'DELETE') {
    await deleteUser(id)
    return res.status(204).end()
  }
}
