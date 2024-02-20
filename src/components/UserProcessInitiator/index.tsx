import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { CheckCircle, RemoveCircleRounded } from '@mui/icons-material'
import { Box, Button, Link, TextField } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import { ITemplateProcessCreated } from 'interfaces/entities/templateProcess'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import Uploader from 'components/Uploader'

type UserProcessInitiatorProps = {
  closeModal: Dispatch<SetStateAction<boolean>>
  templateProcess: ITemplateProcessCreated
  buttonText?: undefined | string
}

export default function UserProcessInitiator({
  closeModal,
  buttonText,
  templateProcess
}: UserProcessInitiatorProps) {
  const [setToaster] = useGlobalStore((state) => [state.setToaster])
  const [deleteDocument] = useMainStore((state) => [state.deleteDocument])
  const [createProcess] = useMainStore((state) => [state.createProcess])

  const [processName, setProcessName] = useState('')
  const [processFileList, setProcessFileList] = useState<any[]>([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { uploaderDocument } = useUpload()

  function fileAdapter(file: any) {
    const fileKey = file.key
    const fileKeyItems = fileKey.split('.')
    const name = fileKeyItems[1]
    const type = fileKeyItems[fileKeyItems.length - 1]

    return { id: file.id, name, type }
  }

  function removeDoc(id: string) {
    const nextProcessFileList = processFileList.filter((doc) => doc.id !== id)
    setProcessFileList(nextProcessFileList)
    deleteDocument(id)
  }

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      if (processFileList?.length === 25) {
        setToaster({
          isOpen: true,
          message: 'Você atingiu o limite de arquivos',
          type: 'error'
        })
        return
      }

      if (processFileList?.length === 25) {
        setToaster({
          isOpen: true,
          message: 'Você atingiu o limite de arquivos',
          type: 'error'
        })
        return
      }

      const mediaFiles = await uploaderDocument(files)

      const newProcessList = [...processFileList]
      if (!mediaFiles) return
      for (const file of mediaFiles) {
        const newProcessFile = fileAdapter(file)
        newProcessList.push(newProcessFile)
      }

      setProcessFileList(newProcessList)
    } catch (error: any) {
      setToaster({
        isOpen: true,
        message: 'Erro ao salvar documento',
        type: 'error'
      })
    }
  }

  const sendProcessRequest = async () => {
    if (processFileList.length === 0) {
      setToaster({
        isOpen: true,
        message: 'Arquivo não encontrado',
        type: 'error'
      })
      return
    }

    const documentIds = processFileList.map((doc) => doc.id)
    createProcess({
      documentIds: documentIds || [],
      title: processName,
      templateProcessId: templateProcess.id
    })
    closeModal(false)
  }

  useEffect(() => {
    if (processFileList.length !== 0 && processName) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [processName, processFileList])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-start justify-center">
        <Link
          className="flex flex-col items-center mb-4 w-full"
          download
          href={templateProcess.bucketUrl}
        >
          Baixar modelo
        </Link>
        <div className="flex flex-col items-start mb-2 w-full">
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
          <label htmlFor="document">Arquivos do processo:</label>
          {
            <Uploader
              uploadFile={uploadFile}
              type="document"
              multiple
              description="Clique para adicionar arquivo"
            />
          }
          <Box mt={2}>
            {processFileList.length > 0 && (
              <ul className="w-72 h-24 border p-4 overflow-auto overflow-x-hidden">
                {processFileList.map((el, idx) => {
                  return (
                    <li
                      key={idx}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="hover:underline text-[13px] w-10/12 truncate">
                        {el.name}
                      </div>
                      <button
                        className="hover:scale-125"
                        onClick={() => removeDoc(el.id)}
                      >
                        <RemoveCircleRounded
                          sx={{ fontSize: 13, color: 'grey' }}
                        />
                      </button>
                      <CheckCircle sx={{ fontSize: 13, color: 'green' }} />
                    </li>
                  )
                })}
              </ul>
            )}
          </Box>
        </div>
        <div className="py-1 text-sm mt-1 mb-1 w-full flex gap-2 items-baseline justify-center">
          <p>
            Arquivos adicionados:
            <span className="text-green-500">{processFileList.length}</span>
          </p>
        </div>
        <div className="py-1 border text-gray-500 text-xs mt-1 mb-1 w-full flex gap-2 items-baseline justify-center">
          <p>Você pode adicionar até 25 arquivos.</p>
        </div>
        <div className="py-2 mt-4 mb-2 w-full flex gap-2 items-baseline justify-center">
          <Button
            variant="contained"
            onClick={sendProcessRequest}
            disabled={isButtonDisabled}
          >
            {buttonText || 'Criar modelo'}
          </Button>
        </div>
      </div>
    </div>
  )
}
