import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Alert, Snackbar, ThemeProvider, createTheme } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'
import DashboardLayout from 'wrappers/DashboardLayout'

export default function App({ Component, pageProps, router }: AppProps) {
  const [toaster, setToaster] = useGlobalStore((state) => [
    state.toaster,
    state.setToaster
  ])

  const { isOpen, message, type, duration } = toaster

  function handleClose() {
    setToaster({ ...toaster, isOpen: false })
  }

  const theme = createTheme({})

  const isUnloggedPage =
    router.pathname === '/login' ||
    router.pathname === '/' ||
    router.pathname === '/create-account'

  return (
    <ThemeProvider theme={theme}>
      {isUnloggedPage ? (
        <Component {...pageProps} />
      ) : (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      )}
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
    </ThemeProvider>
  )
}
