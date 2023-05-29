import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, TextField } from '@mui/material'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import { validationSchema } from './schema'

interface IFormValues {
  companyId: string
  name: string
  email: string
  password: string
}

export default function AccountRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormValues>({
    resolver: yupResolver(validationSchema)
  })

  const router = useRouter()

  const [loading, setLoading, setError, setToaster] = useGlobalStore(
    (state) => [
      state.loading,
      state.setLoading,
      state.setError,
      state.setToaster
    ]
  )

  async function createAccount(values: IFormValues) {
    try {
      await httpServices.user.create(values).then(() => {
        setToaster({
          isOpen: true,
          message:
            'Solicitação de cadastro enviada com sucesso! Aguarde sua conta ser liberar antes de tentar entrar no sistema. Voce receberá um e-mail de confirmando a liberação do acesso.',
          type: 'success',
          duration: 10000
        })
        router.push('/login')
      })
    } catch (error) {
      setError(error)
      setToaster({
        isOpen: true,
        message: 'Erro ao cadastrar usuário. Tente novamente!',
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
        onSubmit={handleSubmit(createAccount)}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar conta
        </h2>
        <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-3">
          <div>
            <TextField
              id="company"
              label="Empresa"
              variant="outlined"
              fullWidth
              error={!!errors.companyId}
              helperText={errors.companyId?.message}
              {...register('companyId')}
            />
          </div>
          <div>
            <TextField
              id="user-name"
              label="Nome"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div>
            <TextField
              id="email-address"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>

        {!loading && (
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar
            </button>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        )}
      </form>
    </div>
  )
}
