import { ReactNode } from 'react'

import {
  Alert,
  Grid,
  Snackbar,
  Box,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
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

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Grid container sx={{ height: '100vh' }}>
        {!isMobile && (
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            sx={{ border: 'solid 1px rgb(229, 231, 235)' }}
          >
            <AsidePanel />
          </Grid>
        )}
        <Divider />
        <Grid item xs={12} sm={12} md={10}>
          <Box sx={{ height: '4rem', background: 'white' }}>
            <HeaderBar />
          </Box>
          <Divider />
          <Box sx={{ pt: 3 }}>
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
