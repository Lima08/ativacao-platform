import { Close } from '@mui/icons-material'
import { IconButton, Box, Typography } from '@mui/material'

interface ModalCustomProps {
  title?: string
  children: React.ReactNode
  closeModal: () => void
}

function ModalCustom({ children, title, closeModal }: ModalCustomProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <Box
        sx={{
          width: 400,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {title && <Typography variant="h6">{title}</Typography>}
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Box>
  )
}

export default ModalCustom
