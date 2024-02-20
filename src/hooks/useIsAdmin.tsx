import { useEffect, useState } from 'react'

import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

function useIsAdmin() {
  const { user } = useAuthStore((state) => state) as IAuthStore
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user || !user.role) return
    if (user.role >= ROLES.COMPANY_ADMIN) {
      setIsAdmin(true)
    }
  }, [user])

  return isAdmin
}

export default useIsAdmin
