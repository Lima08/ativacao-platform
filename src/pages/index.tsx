import Link from 'next/link'
import React from 'react'

import { Button, ThemeProvider, createTheme } from '@mui/material'
const theme = createTheme({
  palette: {
    primary: {
      main: '#0000ff'
    }
  }
})
export default function Homepage() {
  return (
    <ThemeProvider theme={theme}>
      <main className="container h-screen w-screen mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          <Button variant="contained">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button variant="contained" color="primary">
            <Link href="/create-account">Criar uma conta</Link>
          </Button>
        </div>
        <div>
          <h1>Pagina inicial | Quem somos </h1>
        </div>
      </main>
    </ThemeProvider>
  )
}
