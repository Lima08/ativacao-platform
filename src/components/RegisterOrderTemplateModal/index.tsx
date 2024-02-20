import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Box, Button, InputLabel, Modal, TextField } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import LoadingScreen from 'components/LoadingScreen'
import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

type RegisterOrderTemplateViewProps = {
  closeModal: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  onCreateItem?: () => void
}

export default function RegisterOrderTemplateView({
  closeModal,
  isOpen,
  onCreateItem
}: RegisterOrderTemplateViewProps) {
  const [loading, setLoading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setLoading,
    state.setToaster
  ])

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4
  }

  const [orderTemplateName, setOrderTemplateName] = useState('')
  const [orderTemplateFile, setOrderTemplateFile] = useState<string | null>(
    null
  )
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { uploaderDocument } = useUpload()

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      const mediaFile = await uploaderDocument(files)
      if (!mediaFile) return
      setOrderTemplateFile(mediaFile[0].url)
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: 'Error ao salvar documento',
        type: 'error'
      })
    }
  }

  const resetModalState = () => {
    setOrderTemplateName('')
    setOrderTemplateFile(null)
  }

  const sendOrderRequest = async () => {
    if (!orderTemplateFile) {
      setToaster({
        isOpen: true,
        message: 'Arquivo não encontrado',
        type: 'error'
      })
      return
    }

    setLoading(true)
    try {
      await httpServices.templateOrder.create({
        title: orderTemplateName,
        bucketUrl: orderTemplateFile
      })
      onCreateItem && onCreateItem()
      resetModalState()
      setToaster({
        isOpen: true,
        message: 'Modelo criado com sucesso',
        type: 'success'
      })
    } catch (error) {
      setToaster({
        isOpen: true,
        message:
          'Erro ao criar modelo. Tente novamente ou entre em contato com o suporte',
        type: 'error'
      })
    } finally {
      closeModal(false)
      setLoading(false)
    }
  }

  const onModalClose = () => {
    resetModalState()
    closeModal(false)
  }

  useEffect(() => {
    if (orderTemplateFile && orderTemplateName) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [orderTemplateFile, orderTemplateName])

  return (
    <Modal open={isOpen} onClose={onModalClose}>
      <>
        {loading && <LoadingScreen />}

        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              mb: 2
            }}
          >
            <InputLabel htmlFor="orderTemplateName">
              Nome do modelo de pedido:
            </InputLabel>
            <TextField
              id="orderTemplateName"
              name="orderTemplateName"
              variant="outlined"
              type="text"
              value={orderTemplateName}
              onChange={(e) => setOrderTemplateName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              width: '100%',
              mt: 2
            }}
          >
            <InputLabel htmlFor="document" sx={{ textAlign: 'left' }}>
              Arquivo do pedido:
            </InputLabel>
            {!orderTemplateFile && (
              <Uploader uploadFile={uploadFile} type="document" />
            )}
            {!loading && orderTemplateFile && (
              <SuccessAction message="Arquivo salvo com sucesso!" />
            )}
          </Box>

          <Box
            sx={{
              py: 2,
              mt: 4,
              mb: 2,
              width: '100%',
              display: 'flex',
              gap: 4,
              alignItems: 'baseline',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={sendOrderRequest}
              disabled={isButtonDisabled}
            >
              Criar modelo
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  )
}
