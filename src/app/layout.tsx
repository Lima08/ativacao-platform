import './globals.css'
import { ReactNode } from 'react'
import { checkIdPublicRoute } from 'functions'
import { usePathname } from 'next/navigation'
import { PrivateRoute } from 'components/PrivateRoute'

// TODO: Configurar para excluir imports não utilizados
export const metadata = {
  title: 'MVP - Ativação',
  description: 'MVP plataforma Ativação'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = checkIdPublicRoute(pathname)
  return (
    <html lang="en">
      <body className="">
        {isPublicPage && children}
        {!isPublicPage && <PrivateRoute>{children}</PrivateRoute>}
      </body>
    </html>
  )
}
