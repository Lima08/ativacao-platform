'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { checkUserAuthenticated } from 'functions'
import { APP_ROUTES } from 'constants/app-routes'

type PrivateRouteProps = {
  children: ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter()

  const isUserAuthenticated = checkUserAuthenticated()

  useEffect(() => {
    if (!isUserAuthenticated) {
      router.push(APP_ROUTES.public.login)
    }
  }, [isUserAuthenticated, router.push])

  return (
    <>
      {!isUserAuthenticated && null}
      {isUserAuthenticated && children}
    </>
  )
}
