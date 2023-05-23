'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { Button } from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { useAuthStore } from 'store/useAuthStore'

type PageContainerProps = {
  children: ReactNode
  pageTitle: string
  pageSection: string
}

export default function PageContainer({
  pageTitle,
  pageSection,
  children
}: PageContainerProps) {
  const role = useAuthStore((state) => state.user?.role)
  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()

  function navToCreatePage() {
    router.push(`/in/${pageSection}/new`)
  }

  useEffect(() => {
    setIsAdmin(role >= ROLES.COMPANY_ADMIN)
  }, [role])
  return (
    <div className="w-full flex flex-col py-[25px] items-center">
      <div className="w-9/12 flex flex-row justify-around items-center">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        {isAdmin && (
          <Button
            onClick={navToCreatePage}
            variant="contained"
            className="bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 font-bold"
          >
            <p>Adicionar</p>
          </Button>
        )}
      </div>
      <div className="flex flex-col mx-auto">{children}</div>
    </div>
  )
}
