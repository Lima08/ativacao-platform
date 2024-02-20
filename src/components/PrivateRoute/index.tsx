'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { APP_ROUTES } from 'constants/appRoutes'
import { checkUserAuthenticated } from 'functions'

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
  }, [isUserAuthenticated, router])

  return (
    <>
      {!isUserAuthenticated && null}
      {isUserAuthenticated && children}
    </>
  )
}
