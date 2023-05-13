'use client'

import { ReactNode } from 'react'
// import { checkIdPublicRoute } from 'functions'
// import { usePathname } from 'next/navigation'
// import { PrivateRoute } from 'components/PrivateRoute'
// import './globals.css'


export default function RootLayout({ children }: { children: ReactNode }) {
  // const pathname = usePathname()
  // const isPublicPage = checkIdPublicRoute(pathname)
  return (
    <html lang="en">
      <body>
        {/* {isPublicPage && children}
        {!isPublicPage && <PrivateRoute>{children}</PrivateRoute>} */}
        {children}
      </body>
    </html>
  )
}
