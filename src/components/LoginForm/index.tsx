import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CircularProgress, Divider } from '@mui/material'
import httpServices from 'services/http'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'

import { validationSchema } from './schema'

interface IFormValues {
  email: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormValues>({
    resolver: yupResolver(validationSchema)
  })

  const [loading, setLoading, setError, setToaster] = useGlobalStore(
    (state) => [
      state.loading,
      state.setLoading,
      state.setError,
      state.setToaster
    ]
  )

  const router = useRouter()
  const setUserLogged = useAuthStore((state: any) => state.setUserLogged)

  async function loginAccount(values: IFormValues) {
    try {
      const loginData = await httpServices.user.login(values)
      if (!loginData) return

      setUserLogged({ company: loginData.company, user: loginData.user })
      router.push('/in/campaigns')
    } catch (error: any) {
      setError(error)
      setToaster({
        isOpen: true,
        message: 'Erro ao fazer login. Tente novamente!',
        type: 'error'
      })
    } finally {
      setLoading(false)
      reset()
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-8 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded ">
      <div>
        <img
          className="mx-auto h-12 w-auto"
          src="/logo-ativacao.png"
          alt="Workflow"
        />
      </div>

      <form
        className="mt-8 space-y-6 w-64 md:w-80"
        onSubmit={handleSubmit(loginAccount)}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          O que deseja fazer?
        </h2>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push('/create-account')}
        >
          Criar conta
        </Button>
        <Divider>ou</Divider>

        <p className="mt-6 text-center  font-extrabold text-gray-900">
          Entrar na plataforma
        </p>
        <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-3">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              type="email"
              {...register('email')}
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
            {errors.email && (
              <span className=" text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="senha"
            />
            {errors.password && (
              <span className=" text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        {!loading && (
          <>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Entrar
              </button>
            </div>
          </>
        )}

        {loading && <CircularProgress />}
      </form>
    </div>
  )
}
