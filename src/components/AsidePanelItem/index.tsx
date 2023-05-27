import Link from 'next/link'
import { ReactElement } from 'react'

import { ListItem, Typography, Box } from '@mui/material'

interface AsidePanelItemProps {
  title: string
  linkSrc: string
  icon: ReactElement
}

const AsidePanelItem = ({ title, linkSrc, icon }: AsidePanelItemProps) => {
  return (
    <ListItem disableGutters sx={{ ':hover': { backgroundColor: '#F3F4F6' } }}>
      <Link href={linkSrc} passHref>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            borderRadius: 'lg'
          }}
        >
          {icon}
          <Typography variant="body1" component="span" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
      </Link>
    </ListItem>
  )
}

export default AsidePanelItem
