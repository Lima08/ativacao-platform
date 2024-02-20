import Link from 'next/link'
import { useRouter } from 'next/router'

import { Breadcrumbs, Typography, useTheme } from '@mui/material'

const BreadcrumbCustom = () => {
  const router = useRouter()
  const theme = useTheme()

  const PATH_TO_IGNORE = ['home', 'in', '[id]']
  const PATH_TRANSLATION: Record<string, string> = {
    campaigns: 'Campanhas',
    analyzes: 'Análises',
    trainings: 'Treinamentos',
    notifications: 'Notificações',
    users: 'Usuários'
  }
  const pathnames = router.pathname.split('/').filter((x) => x)

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link href="/in/home">Início</Link>
      {pathnames.map((pathname, index) => {
        if (PATH_TO_IGNORE.includes(pathname)) return

        const url = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1

        return (
          <Link key={url} href={url}>
            <Typography
              color={isLast ? '#000000' : '#121212'}
              fontWeight={isLast ? '600' : '400'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 'lg',
                position: 'relative',
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
                  transform: 'scaleX(0)'
                },
                ':hover::before': {
                  transform: 'scaleX(1)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              {PATH_TRANSLATION[pathname]}
            </Typography>
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}

export default BreadcrumbCustom
