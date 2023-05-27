'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { Button } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

type PageContainerProps = {
  children: ReactNode
  pageTitle: string
  pageSection: string
  customCallback?: () => void
}

export default function PageContainer({
  pageTitle,
  pageSection,
  children,
  customCallback
}: PageContainerProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore

  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()

  function navToCreatePage() {
    if (customCallback) {
      customCallback()
    } else {
      router.push(`/in/${pageSection}/new`)
    }
  }

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])
  return (
    <div className=" flex flex-col items-center px-16 py-2">
      <div className="w-full flex flex-row justify-between items-center ">
        <h2 className="text-2xl font-medium">{pageTitle}</h2>
        {isAdmin && (
          <Button variant="outlined" onClick={navToCreatePage}>
            Adicionar
          </Button>
        )}
      </div>
      <section className="w-full flex flex-col mt-8">{children}</section>
    </div>
  )
}
