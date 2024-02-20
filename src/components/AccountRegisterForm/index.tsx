import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton, TextField, Card, Button } from '@mui/material'
import { ONE_SECOND } from 'constants/index'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'

import LoadingScreen from 'components/LoadingScreen'

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
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }
  async function createAccount(values: IFormValues) {
    try {
      await httpServices.user.create(values)

      setToaster({
        isOpen: true,
        message:
          'Solicitação de cadastro enviada com sucesso! Aguarde sua conta ser liberar antes de tentar entrar no sistema. Voce receberá um e-mail de confirmando a liberação do acesso.',
        type: 'success',
        duration: ONE_SECOND
      })
      router.push('/login')
    } catch (error: any) {
      console.error(error)
      setError(error)
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

  return (
    <Card className="flex flex-col  items-center justify-center  py-12 px-4 sm:px-6 lg:px-8 rounded ">
      <Image
        alt="Logo Ativação"
        src="/logo-ativacao.png"
        width="250"
        height="140"
      />
      <form
        className="mt-8 w-64 md:w-96 text-center flex flex-col items-center justify-center gap-2"
        onSubmit={handleSubmit(createAccount)}
      >
        <TextField
          id="company"
          label="Empresa"
          variant="outlined"
          fullWidth
          error={!!errors.companyId}
          helperText={errors.companyId?.message}
          {...register('companyId')}
        />
        <TextField
          id="user-name"
          label="Nome do usuário"
          variant="outlined"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
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

        {!loading && (
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 4 }}>
            Criar conta
          </Button>
        )}

        <div className="flex items-center justify-between w-full gap-2 mt-4">
          <Button
            variant="outlined"
            fullWidth
            type="button"
            onClick={() => router.push('/login')}
            size="small"
          >
            Fazer login
          </Button>
          <Button
            variant="outlined"
            fullWidth
            type="button"
            onClick={() => router.push('/')}
            size="small"
          >
            Voltar
          </Button>
        </div>

        {loading && <LoadingScreen />}
      </form>
    </Card>
  )
}
