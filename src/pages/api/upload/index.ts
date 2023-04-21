import { NextApiRequestWithMulter, NextApiResponse } from 'next'
import { REQUEST_METHODS } from 'constants/http/requestMethods'
import files from 'useCases/files'
import { uploadS3Multer } from 'middlewares/upload'

/* 
- [x]  salvar uma imagem e utilizar o seu retorno para definir o tipo para salvar no banco
- [ ] conseguir deletar uma imagem especifica - bucket e banco
- [ ] retorno de campaigns com array de imagens  
- [ ] Salvar da campanha envia um array de videos e imagens (ja salvas no bucket pelo upload) e no usecase atualiza image com id da campanha
- [ ] no delete de uma campanha deletar imagens do banco e do bucket

*/

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(
  req: NextApiRequestWithMulter,
  res: NextApiResponse
) {
  switch (req.method) {
    case REQUEST_METHODS.POST:
      try {
        //@ts-ignore
        uploadS3Multer(req, res, async (error) => {
          if (error) {
            res.status(400).json({ error: { message: error.message } })
            return
          }

          const url = req.file.location
          const type = req.file.mimetype
          const { trainingId, campaignId } = req.body

          const createdUpload = await files.create(type, {
            trainingId,
            url,
            campaignId
          })

          res.status(201).json({ data: createdUpload })
        })
      } catch (error) {
        res.status(500).json({ error: { message: 'Error upload image' } })
      }
      break

    default:
      res.status(400).json({ error: { message: 'Invalid method' } })
      break
  }
}
