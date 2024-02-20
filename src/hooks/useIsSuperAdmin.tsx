import { useEffect, useState } from 'react'

import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

function useIsSuperAdmin() {
  const { user } = useAuthStore((state) => state) as IAuthStore
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    if (!user || !user.role) return
    if (user.role >= ROLES.SYSTEM_ADMIN) {
      setIsSuperAdmin(true)
    }
  }, [user])

  return isSuperAdmin
}

export default useIsSuperAdmin
