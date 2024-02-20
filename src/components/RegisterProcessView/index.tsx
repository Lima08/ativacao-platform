import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

type RegisterProcessViewProps = {
  closeModal: Dispatch<SetStateAction<boolean>>
}

export default function RegisterProcessView({
  closeModal
}: RegisterProcessViewProps) {
  const [loading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setToaster
  ])

  const [createTemplateProcess] = useMainStore((state) => [
    state.createTemplateProcess
  ])
  const [processName, setProcessName] = useState('')
  const [processFile, setProcessFile] = useState<string | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { uploaderDocument } = useUpload()

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const mediaFile = await uploaderDocument(files)
      if (!mediaFile) return
      setProcessFile(mediaFile[0].url)
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: 'Error ao salvar documento',
        type: 'error'
      })
    }
  }

  const sendProcessRequest = async () => {
    if (!processFile) {
      setToaster({
        isOpen: true,
        message: 'Arquivo não encontrado',
        type: 'error'
      })
      return
    }

    createTemplateProcess({
      title: processName,
      bucketUrl: processFile
    })
    closeModal(false)
  }

  useEffect(() => {
    if (processFile && processName) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [processFile, processName])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-start justify-center">
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="processName">Nome do processo:</label>

          <TextField
            id="processName"
            name="processName"
            variant="outlined"
            type="text"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex flex-col items-start w-full mt-2">
          <label htmlFor="document" className="text-left">
            Arquivo do processo:
          </label>
          {!processFile && <Uploader uploadFile={uploadFile} type="document" />}
          {!loading && processFile && (
            <SuccessAction message="Arquivo salvo com sucesso!" />
          )}
        </div>

        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <Button
            variant="contained"
            onClick={sendProcessRequest}
            disabled={isButtonDisabled}
          >
            Criar modelo
          </Button>
        </div>
      </div>
    </div>
  )
}
