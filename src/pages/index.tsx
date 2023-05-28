import Link from 'next/link'
import React from 'react'

import { Button } from '@mui/material'
export default function Homepage() {
  return (
    <main className="container h-screen w-screen mx-auto flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        <Button variant="contained">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button variant="contained">
          <Link href="/create-account">Criar uma conta</Link>
        </Button>
      </div>
    </main>
  )
}
