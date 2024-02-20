import { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
  Chip
} from '@mui/material'
import useIsAdmin from 'hooks/useIsAdmin'
import useMainStore from 'store/useMainStore'
import { useNotificationStore } from 'store/useNotificationStore'

import { formatDate } from '../../../utils'

type NotificationCardProps = {
  id: string
  title: string
  description: string
  imageUrl?: string
  link?: string
  createdAt: Date
  canDelete?: boolean
}

export default function NotificationCardItem({
  id,
  title,
  description,
  imageUrl,
  link,
  createdAt,
  canDelete = false
}: NotificationCardProps) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const [deleteNotification] = useMainStore((state) => [
    state.deleteNotification
  ])
  const [notificationsViewed] = useNotificationStore((state: any) => [
    state.notificationsViewed
  ])

  const isAdmin = useIsAdmin()

  return (
    <>
      <Card
        sx={{
          width: '100%',
          minWidth: 200,
          maxWidth: 300,
          position: 'relative'
        }}
      >
        {!notificationsViewed.includes(id) && (
          <div className="absolute top-2 left-2 z-10">
            <Chip label="Novo" color="success" />
          </div>
        )}
        {canDelete && isAdmin && (
          <IconButton
            style={{ zIndex: 1 }}
            className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setOpenConfirmDelete(true)
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        )}
        {imageUrl && (
          <CardMedia
            sx={{ height: 180, objectFit: 'scale-down' }}
            image={imageUrl}
            title={title}
          />
        )}
        <CardContent>
          <div className="flex flex-row-reverse mr-6">
            <Typography variant="subtitle2" component="div" color="#4f4f4f">
              {formatDate(String(createdAt), 'dd/LL/yyyy - HH:mm')}
            </Typography>
          </div>

          <div style={{ width: '100%' }}>
            <Accordion sx={{ border: 'none', boxShadow: 'none' }}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      borderRadius: '100%',
                      ':hover': {
                        color: 'black',
                        background: 'rgba(0,0,0,0.35)'
                      }
                    }}
                  />
                }
                onClick={(e) => e.stopPropagation()}
              >
                <Typography variant="h6" component="div" color="#4f4f4f">
                  {title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography overflow="hidden" color="5c5c5c">
                  {description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </CardContent>

        {link && (
          <CardActions>
            <Button size="small">
              <a href={link} target="_blank" rel="noreferrer">
                ABRIR LINK
              </a>
            </Button>
          </CardActions>
        )}
      </Card>

      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
      >
        <div className="p-4">
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza de que deseja excluir este item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setOpenConfirmDelete(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                deleteNotification(id)
              }}
              variant="contained"
              color="error"
            >
              Excluir
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  )
}
