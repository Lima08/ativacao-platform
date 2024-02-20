import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import httpServices from 'services/http'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'

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
  const router = useRouter()
  const [setUser, setCompany] = useAuthStore((state: any) => [
    state.setUser,
    state.setCompany
  ])

  const [resetMainState, createLog] = useMainStore((state) => [
    state.resetMainState,
    state.createLog
  ])

  const [loading, setLoading, setError, setToaster] = useGlobalStore(
    (state) => [
      state.loading,
      state.setLoading,
      state.setError,
      state.setToaster
    ]
  )

  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  async function loginAccount(values: IFormValues) {
    try {
      setLoading(true)
      setError(null)

      const { data } = await httpServices.user.login(values)

      if (!data) return

      setUser(data.user)
      setCompany(data.company)
      resetMainState()
      createLog({
        module: 'Login',
        info: 'Login'
      })

      router.push('/in/home')
    } catch (error: any) {
      console.error(error)
      setToaster({
        isOpen: true,
        message: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
      reset()
    }
  }
  useEffect(() => {
    window.localStorage.clear()
  }, [])

  return (
    <Card className="flex flex-col  md:gap-8 items-center justify-center  py-12 px-4 sm:px-6 lg:px-8 rounded ">
      <Image
        alt="Logo Ativação"
        src="/logo-ativacao.png"
        width="250"
        height="140"
      />
      <form
        className="mt-4 space-y-6 w-64 md:w-96 flex flex-col items-center justify-center text-center"
        onSubmit={handleSubmit(loginAccount)}
      >
        <Typography variant="h4" gutterBottom>
          O que deseja fazer?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push('/create-account')}
        >
          Criar conta
        </Button>

        <Divider>ou</Divider>

        <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-3 w-full">
          <Typography variant="h6" gutterBottom>
            Entrar na plataforma
          </Typography>
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

          <TextField
            id="password"
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="senha"
            label="Senha"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />
        </div>

        {!loading && (
          <Button variant="contained" fullWidth type="submit">
            Entrar
          </Button>
        )}

        <Button
          variant="text"
          fullWidth
          type="button"
          onClick={() => router.push('/')}
          size="small"
        >
          Voltar
        </Button>
      </form>

      {loading && <LoadingScreen />}
    </Card>
  )
}
