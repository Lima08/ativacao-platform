import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { CheckCircle, RemoveCircleRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  Modal,
  TextField,
  Typography
} from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import { ITemplateOrderCreated } from 'interfaces/entities/templateOrder'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import Uploader from 'components/Uploader'

type OrderRegisterModalProps = {
  closeModal: Dispatch<SetStateAction<boolean>>
  templateOrder: ITemplateOrderCreated
  isOpen: boolean
  buttonText?: undefined | string
  onCreateItem?: () => void
}

export default function OrderRegisterModal({
  closeModal,
  templateOrder,
  isOpen,
  buttonText,
  onCreateItem
}: OrderRegisterModalProps) {
  const [loading, setLoading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setLoading,
    state.setToaster
  ])
  const [deleteDocument] = useMainStore((state) => [state.deleteDocument])

  const [OrderName, setOrderName] = useState('')
  const [OrderFileList, setOrderFileList] = useState<any[]>([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { uploaderDocument } = useUpload()

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

  function fileAdapter(file: any) {
    const fileKey = file.key
    const fileKeyItems = fileKey.split('.')
    const name = fileKeyItems[1]
    const type = fileKeyItems[fileKeyItems.length - 1]

    return { id: file.id, name, type }
  }

  function removeDoc(id: string) {
    const nextOrderFileList = OrderFileList.filter((doc) => doc.id !== id)
    setOrderFileList(nextOrderFileList)
    deleteDocument(id)
  }

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target.files

    try {
      if (OrderFileList?.length === 25) {
        setToaster({
          isOpen: true,
          message: 'Você atingiu o limite de arquivos',
          type: 'error'
        })
        return
      }

      if (OrderFileList?.length === 25) {
        setToaster({
          isOpen: true,
          message: 'Você atingiu o limite de arquivos',
          type: 'error'
        })
        return
      }

      const mediaFiles = await uploaderDocument(files)

      const newOrderList = [...OrderFileList]
      if (!mediaFiles) return
      for (const file of mediaFiles) {
        const newOrderFile = fileAdapter(file)
        newOrderList.push(newOrderFile)
      }

      setOrderFileList(newOrderList)
    } catch (error: any) {
      setToaster({
        isOpen: true,
        message: 'Erro ao salvar documento',
        type: 'error'
      })
    }
  }

  const resetModalState = () => {
    setOrderName('')
    setOrderFileList([])
  }

  const sendOrderRequest = async () => {
    if (OrderFileList.length === 0) {
      setToaster({
        isOpen: true,
        message: 'Arquivo não encontrado',
        type: 'error'
      })
      return
    }

    const documentIds = OrderFileList.map((doc) => doc.id)
    setLoading(true)
    try {
      await httpServices.order.create({
        documentIds: documentIds || [],
        title: OrderName,
        templateOrderId: templateOrder.id
      })
      onCreateItem && onCreateItem()
      resetModalState()
      setToaster({
        isOpen: true,
        message: 'Pedido enviado com sucesso',
        type: 'success'
      })
    } catch (error) {
      console.error(error)
      setToaster({
        isOpen: true,
        message:
          'Erro ao criar pedido. Tente novamente ou entre em contato com o suporte',
        type: 'error'
      })
    } finally {
      onModalClose()
      setLoading(false)
    }
  }

  const onModalClose = () => {
    resetModalState()
    closeModal(false)
  }

  useEffect(() => {
    if (OrderFileList.length !== 0 && OrderName) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [OrderName, OrderFileList])

  return (
    <Modal open={isOpen} onClose={onModalClose}>
      <>
        {loading && <LoadingScreen />}

        <Box sx={style}>
          <Link
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={4}
            width="100%"
            download
            href={templateOrder.bucketUrl}
          >
            <Button variant="contained" color="primary">
              Baixar modelo
            </Button>
          </Link>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              mb: 2,
              width: '100%'
            }}
          >
            <InputLabel htmlFor="OrderName">Nome do pedido:</InputLabel>
            <TextField
              id="OrderName"
              name="OrderName"
              variant="outlined"
              type="text"
              value={OrderName}
              onChange={(e) => setOrderName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100% ',
              my: 2,
              py: 1,
              fontSize: '0.875rem',
              alignItems: 'start',
              justifyContent: 'center'
            }}
          >
            <InputLabel htmlFor="document">Arquivos do pedido:</InputLabel>
            <Uploader
              uploadFile={uploadFile}
              type="document"
              multiple
              description="Clique para adicionar arquivo"
            />
            {OrderFileList.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  mt: 2,
                  mb: 1,
                  border: '1px solid',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <List
                  sx={{
                    width: '100%',
                    height: '6rem',
                    p: 1,
                    overflow: 'auto'
                  }}
                >
                  {OrderFileList.map((el, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <div className="flex  items-center justify-start gap-1">
                        <CheckCircle
                          sx={{
                            fontSize: 13,
                            color: 'green',
                            '&:hover': {
                              fontSize: 13,
                              color: 'green !important'
                            }
                          }}
                        />
                        <Typography variant="body2" noWrap>
                          {el.name}
                        </Typography>
                      </div>
                      <IconButton
                        sx={{ p: 0, '&:hover': { transform: 'scale(1.25)' } }}
                        onClick={() => removeDoc(el.id)}
                      >
                        <RemoveCircleRounded
                          sx={{
                            fontSize: 13,
                            color: 'grey',
                            '&:hover': { fontSize: 13, color: 'red !important' }
                          }}
                        />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <Typography component="p">
              Arquivos adicionados:
              <Typography component="span" sx={{ color: 'green' }}>
                {` ${OrderFileList.length}`}
              </Typography>
            </Typography>
          </Box>

          <Box
            sx={{
              py: 1,
              border: 1,
              color: 'grey.500',
              fontSize: '0.75rem',
              mt: 1,
              mb: 1,
              width: '100%',
              display: 'flex',
              gap: 2,
              alignItems: 'baseline',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Typography component="p">
              Você pode adicionar até 25 arquivos.
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 4,
              width: '100%',
              display: 'flex',
              gap: 2,
              alignItems: 'baseline',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={sendOrderRequest}
              disabled={isButtonDisabled}
            >
              {buttonText || 'Criar modelo'}
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  )
}
