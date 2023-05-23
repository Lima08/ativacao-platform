import { ReactNode } from 'react'

import { Alert, Snackbar } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

import AsidePanel from 'components/AsidePanel'
import BaseNavbar from 'components/BaseNavbar'

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
    <div lang="en">
      <BaseNavbar />
      <AsidePanel />
      <main className="w-full md:w-[calc(100%_-_257px)] h-[calc(100%_-_72px)] mt-[72px] md:ml-[257px]">
        {children}
      </main>

      <Snackbar
        onClose={handleClose}
        open={isOpen}
        autoHideDuration={duration || 5000}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
