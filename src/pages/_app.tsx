import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, createTheme } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({})

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
