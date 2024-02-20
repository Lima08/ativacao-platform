import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material'
import { FIVE_SECONDS } from 'constants/index'
import useGlobalStore from 'store/useGlobalStore'
import globalTheme from 'themes/globalTheme'
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

  const isUnloggedPage =
    router.pathname === '/login' ||
    router.pathname === '/' ||
    router.pathname === '/create-account'

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
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
        autoHideDuration={duration || FIVE_SECONDS}
        role="alert"
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
