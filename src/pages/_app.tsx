import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, createTheme } from '@mui/material'
import DashboardLayout from 'wrappers/DashboardLayout'

export default function App({ Component, pageProps, router }:  AppProps) {
  const theme = createTheme({})
  const isLoginPage = router.pathname === '/login' || router.pathname === '/'

  return (
    <ThemeProvider theme={theme}>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      )}
    </ThemeProvider>
  )
}
