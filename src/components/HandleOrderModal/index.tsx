import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Download } from '@mui/icons-material'
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputLabel,
  Modal
} from '@mui/material'
import useIsAdmin from 'hooks/useIsAdmin'
import { IDocumentCreated } from 'interfaces/entities/document'
import { eOrderStatus } from 'interfaces/entities/Order/EOrderStatus'
import { IOrderAdapted } from 'pages/in/orders'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import LoadingScreen from 'components/LoadingScreen'

type AdminOrderRegisterProps = {
  order: IOrderAdapted
  closeModal: () => void
  isOpen: boolean
}

const STATUS_ORDER_OPTIONS: { label: string; value: eOrderStatus }[] = [
  { label: 'Pendente', value: eOrderStatus.received },
  { label: 'Em separação', value: eOrderStatus.processing },
  { label: 'Rejeitado', value: eOrderStatus.rejected },
  { label: 'Faturado', value: eOrderStatus.invoiced }
]
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

export default function HandleOrderModal({
  order,
  closeModal,
  isOpen
}: AdminOrderRegisterProps) {
  const [loading, setLoading, setError, setToaster] = useGlobalStore(
    (state) => [
      state.loading,
      state.setLoading,
      state.setError,
      state.setToaster
    ]
  )

  const isSystemAdmin = useIsAdmin()

  const [comments, setComments] = useState(order?.message || '')
  const [status, setStatus] = useState<eOrderStatus>(order?.status || null)

  function fileAdapter(file: any) {
    const fileKey = file.key
    const fileKeyItems = fileKey.split('.')
    const name = fileKeyItems[1]
    const type = fileKeyItems[fileKeyItems.length - 1]

    return { id: file.documentId, name, type }
  }

  const resetState = () => {
    setComments('')
  }

  const handleClose = () => {
    resetState()
    closeModal()
  }

  const handleSubmit = async () => {
    try {
      closeModal()

      await httpServices.order.update(order.id, {
        message: comments,
        status
      })

      setToaster({
        isOpen: true,
        message: 'Pedido atualizado com sucesso',
        type: 'success'
      })
    } catch (error: any) {
      console.error(error)
      setError(error)
      setToaster({
        isOpen: true,
        message: error.message,
        type: 'error'
      })
    } finally {
      resetState()
      setLoading(false)
      closeModal()
    }
  }

  useEffect(() => {
    if (order) {
      const { message, status } = order
      message && setComments(message)
      status && setStatus(status)
    }
  }, [order])

  return (
    <Modal open={isOpen} onClose={handleClose} sx={{ p: 4 }}>
      <>
        {loading && <LoadingScreen />}
        <Box sx={style}>
          <Box mt={2} mb={2} sx={{ minWidth: 300 }}>
            <InputLabel htmlFor="message" sx={{ textAlign: 'left' }}>
              Nome do pedido:
            </InputLabel>

            <TextField
              value={order.title}
              variant="outlined"
              type="text"
              fullWidth
              disabled
              sx={{ mb: 2 }}
            />

            <InputLabel htmlFor="message" sx={{ textAlign: 'left' }}>
              Tipo de pedido:
            </InputLabel>

            <TextField
              value={order.templateTitle}
              variant="outlined"
              type="text"
              fullWidth
              disabled
            />
          </Box>

          <Box my={2}>
            <InputLabel htmlFor="documents">Documentos:</InputLabel>

            <Box
              sx={{
                overflow: 'auto',
                maxHeight: 100,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              {order.documents
                .map((el: IDocumentCreated) => {
                  return fileAdapter(el)
                })
                .map((el: any, idx: any) => {
                  return (
                    <Link href={order.documents[idx].url} key={idx}>
                      <ListItem
                        key={idx}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          '&:hover': { bgcolor: 'action.hover' },
                          m: 0,
                          py: 0
                        }}
                      >
                        <ListItemIcon>
                          <Download sx={{ fontSize: 13, color: 'green' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={el.name}
                          primaryTypographyProps={{ noWrap: true }}
                          sx={{ maxWidth: '160px' }}
                        />
                      </ListItem>
                    </Link>
                  )
                })}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              width: '100%'
            }}
          >
            <InputLabel htmlFor="message" sx={{ textAlign: 'left' }}>
              Mensagem:
            </InputLabel>

            <TextField
              id="message"
              value={comments}
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              onChange={(e) => setComments(e.target.value)}
              disabled={!isSystemAdmin}
            />
          </Box>
          {isSystemAdmin && (
            <Box
              sx={{
                py: 1,
                mt: 4,
                mb: 2,
                display: 'flex',
                gap: 4,
                alignItems: 'baseline',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as eOrderStatus)}
                variant="outlined"
              >
                {STATUS_ORDER_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={() => handleSubmit()}
                variant="contained"
                disabled={!status}
                size="large"
              >
                Salvar
              </Button>
            </Box>
          )}
        </Box>
      </>
    </Modal>
  )
}
