import * as React from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import AsidePanel from '.'

export default function AsidePanelMobile() {
  const [state, setState] = React.useState(false)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState(open)
    }

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon color="action" />
      </IconButton>
      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 200
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <AsidePanel />
        </Box>
      </Drawer>
    </>
  )
}
