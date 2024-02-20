import WarningIcon from '@mui/icons-material/Warning'
import { Card, CardContent, Typography, Box } from '@mui/material'
function ErrorAction({ message }: { message?: string | null }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom={2}
        >
          <WarningIcon sx={{ fontSize: 64, color: 'red' }} />
        </Box>
        <Typography variant="h6" align="center">
          {message ? message : 'Um erro inesperado ocorreu!'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ErrorAction
