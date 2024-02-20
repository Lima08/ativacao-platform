import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

type UserAnalysisRegisterProps = {
  closeModal: Dispatch<SetStateAction<boolean>>
}

export default function UserAnalysisRegister({
  closeModal
}: UserAnalysisRegisterProps) {
  const [loading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setToaster
  ])

  const [createAnalysis] = useMainStore((state) => [state.createAnalysis])
  const [analysisTitle, setAnalysisTitle] = useState('')
  const [analysisFile, setAnalysisFile] = useState<string | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { uploaderDocument } = useUpload()

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const mediaFile = await uploaderDocument(files)

      if (!mediaFile) return
      setAnalysisFile(mediaFile[0].url)
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: 'Error ao salvar documento',
        type: 'error'
      })
    }
  }

  const sendAnalysisRequest = async () => {
    if (!analysisFile) {
      setToaster({
        isOpen: true,
        message: 'Arquivo não encontrado',
        type: 'error'
      })
      return
    }

    createAnalysis({
      title: analysisTitle,
      bucketUrl: analysisFile
    })
    closeModal(false)
  }

  useEffect(() => {
    if (analysisFile && analysisTitle) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [analysisFile, analysisTitle])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-2 bg-gray-600 rounded-b-md w-2/4 text-white text-center">
        <h1>Nova solicitação</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-2 mt-4">
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="title" className="text-left">
            Título da análise:
          </label>

          <TextField
            id="title"
            name="title"
            variant="outlined"
            type="text"
            value={analysisTitle}
            onChange={(e) => setAnalysisTitle(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex flex-col items-start w-full mt-2">
          <label htmlFor="document" className="text-left">
            Arquivo para análise:
          </label>
          {!analysisFile && (
            <Uploader uploadFile={uploadFile} type="document" />
          )}
          {!loading && analysisFile && (
            <SuccessAction message=" Arquivo salvo com sucesso!" />
          )}
        </div>

        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <Button
            variant="contained"
            onClick={sendAnalysisRequest}
            disabled={isButtonDisabled}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}
