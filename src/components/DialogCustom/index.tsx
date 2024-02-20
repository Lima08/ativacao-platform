import * as React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'

export interface DialogCustomProps {
  title: string
  open: boolean
  children?: React.ReactNode
}

export default function DialogCustom(props: DialogCustomProps) {
  const { title, open, children } = props

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <div className="flex items-center justify-evenly pb-6">{children}</div>
    </Dialog>
  )
}
