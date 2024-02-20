import { ReactNode } from 'react'

import { Grid, Box, Divider, useTheme, useMediaQuery } from '@mui/material'

import AsidePanel from './AsidePanel'
import HeaderBar from './HeaderBar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container>
      {!isMobile && (
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
          sx={{ border: `solid 1px ${theme.palette.divider}`, height: '100vh' }}
        >
          <AsidePanel />
        </Grid>
      )}
      <Divider />
      <Grid item xs={12} sm={12} md={10}>
        <HeaderBar />
        <Divider />
        <Box>
          <Box>{children}</Box>
        </Box>
      </Grid>
    </Grid>
  )
}
