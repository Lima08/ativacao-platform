import { HTTP_STATUS } from 'constants/enums/eHttpStatusEnum'
// import { updateStatus } from 'useCases/users/userTrainings'

// TODO: ON PROGRESS

export default async function handler(req: any, res: any) {
  // const id = req.query.id as string

  // if (req.method === 'PUT') {
  //   const { status } = req.body

  //   const updatedTraining = await updateStatus(id, {
  //     status
  //   })

  //   return res.status(200).json({ data: updatedTraining })
  // }
  res
    .status(HTTP_STATUS.METHOD_NOT_ALLOWED)
    .json({ error: { message: 'Method not allowed' } })
}
