import { ReactNode } from 'react'

import { Alert, Snackbar } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

import AsidePanel from 'components/AsidePanel'
import BaseNavbar from 'components/BaseNavbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [error, setError] = useGlobalStore((state) => [
    state.error,
    state.setError
  ])

  function handleClose() {
    setError(null)
  }

  return (
    <div lang="en">
      <BaseNavbar />
      <AsidePanel />
      <main className="w-full md:w-[calc(100%_-_257px)] h-[calc(100%_-_72px)] mt-[72px] md:ml-[257px]">
        {children}
      </main>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Note archived"
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Erro ao realizar operação!
        </Alert>
      </Snackbar>
    </div>
  )
}
