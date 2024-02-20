import Link from 'next/link'
import { ReactElement } from 'react'

import { ListItem, Typography, Box, useTheme } from '@mui/material'

interface AsidePanelItemProps {
  title: string
  linkSrc: string
  children: ReactElement
  onClick: (linkSrc: string) => void
  isActive: boolean
  hide?: boolean
}

const AsidePanelItem = ({
  title,
  linkSrc,
  children,
  onClick,
  isActive,
  hide
}: AsidePanelItemProps) => {
  const theme = useTheme()

  const handleClick = () => {
    onClick(linkSrc)
  }

  if (hide) {
    return null
  }

  return (
    <ListItem
      disableGutters
      sx={{
        borderRadius: 2,
        pl: 1,
        ':hover': { opacity: 0.8 },
        ':active': {
          transform: 'scale(0.95)',
          transition: 'transform 0.2s '
        }
      }}
      onClick={handleClick}
    >
      <Link href={linkSrc} passHref className="w-full">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '6px',
            padding: '0.25rem 0.5rem',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'lightgray',
              transition: 'background-color 0.2s ease-in-out',
              color: 'black'
            },
            '::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -3,
              width: '100%',
              height: 3,
              borderRadius: '100%',
              backgroundColor: theme.palette.background.customBackground,
              transformOrigin: 'left',
              transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          {children}
          <Typography
            variant="body1"
            fontWeight="600"
            component="span"
            sx={{
              ml: 1,
              '&:hover': {
                color: 'black'
              }
            }}
          >
            {title}
          </Typography>
        </Box>
      </Link>
    </ListItem>
  )
}

export default AsidePanelItem
