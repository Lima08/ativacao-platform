import { ReactNode } from 'react'

import { Alert, Grid, Snackbar, Box, Divider } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

import AsidePanel from './AsidePanel'
import HeaderBar from './HeaderBar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [toaster, setToaster] = useGlobalStore((state) => [
    state.toaster,
    state.setToaster
  ])

  const { isOpen, message, type, duration } = toaster

  function handleClose() {
    setToaster({ ...toaster, isOpen: false })
  }

  return (
    <>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
          sx={{
            borderRight: '1px solid #ccc',
            pl: 2
          }}
        >
          <AsidePanel />
        </Grid>
        <Divider />
        <Grid item xs={12} sm={9} md={10}>
          <Box sx={{ height: '4rem', background: 'white' }}>
            <HeaderBar />
          </Box>
          <Divider />
          <Box sx={{ pt: 6 }}>
            <main>{children}</main>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        onClose={handleClose}
        open={isOpen}
        autoHideDuration={duration || 5000}
        role="alert"
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
