import Link from 'next/link'
import { ReactNode } from 'react'

import {
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

export default function NavigationCard({
  href,
  children,
  title
}: {
  href: string
  children: ReactNode
  title: string
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Link href={href}>
      <Card
        sx={{
          width: isMobile ? '100%' : '200px',
          borderRadius: '16px',
          transition: 'all 0.3s',
          '&:hover': {
            transform: isMobile ? 'scale(1)' : 'scale(1.1)',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.35)',
            '& .MuiTypography-root::before': {
              transform: 'scaleX(1)',
              transition: 'transform 0.2s ease-in-out'
            }
          }
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: theme.palette.text.contentDefault,
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'lg',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -3,
                width: '100%',
                height: 3,
                borderRadius: '100%',
                backgroundColor: theme.palette.background.customBackground,
                transformOrigin: 'left',
                transform: 'scaleX(0)'
              }
            }}
          >
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Link>
  )
}
