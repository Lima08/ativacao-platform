export const checkUserAuthenticated = () => {
  const userToken = window.localStorage.getItem('user_token')

  return !!userToken
}
