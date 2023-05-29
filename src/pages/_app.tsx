import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, createTheme } from '@mui/material'
import DashboardLayout from 'wrappers/DashboardLayout'

export default function App({ Component, pageProps, router }: AppProps) {
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
    </ThemeProvider>
  )
}
