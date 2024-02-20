import { CheckCircle } from '@mui/icons-material'
import { Card, CardContent, Typography, Box } from '@mui/material'

function SuccessAction({ message }: { message?: string | null }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom={2}
        >
          <CheckCircle sx={{ fontSize: 64, color: 'green' }} />
        </Box>
        <Typography variant="h6" align="center">
          {message ? message : ' Salvo com sucesso!'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SuccessAction
