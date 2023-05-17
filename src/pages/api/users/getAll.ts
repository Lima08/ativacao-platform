import { getUsers } from 'useCases/users'

export default async function handler(req: any, res: any) {
  const companyId = '5c9e558a-1eb8-44d4-9abb-693c65ee57c4'

  if (req.method === 'GET') {
    const user = await getUsers({ companyId })
    return res.status(200).json({ data: user })
  }
}
