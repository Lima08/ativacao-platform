import { APP_ROUTES } from 'constants/appRoutes'

export const checkIdPublicRoute = (path: string | null): boolean => {
  const appPublicRoutes = Object.values(APP_ROUTES.public)

  return !!path && appPublicRoutes.includes(path)
}
