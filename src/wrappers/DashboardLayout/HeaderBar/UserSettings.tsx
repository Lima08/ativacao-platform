import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, TextField, Button, IconButton, Skeleton } from '@mui/material'
import { useUpload } from 'hooks/useUpload'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import * as Yup from 'yup'

import ModalCustom from 'components/ModalCustom'
import SuccessAction from 'components/SuccessAction'
import Uploader from 'components/Uploader'

interface IFormValues {
  name?: string
  password?: string
  newPassword?: string
}
const validationSchema = Yup.object().shape({
  name: Yup.string().max(95, 'Nome muito longo').nullable(),
  password: Yup.string().max(20, 'Senha muito longa').nullable(),
  newPassword: Yup.string()
    .max(20, 'Senha muito longa')
    .test('password-match', 'As senhas não coincidem', function (value) {
      return value === this.parent.password
    })
    .nullable()
})

function UserSettings({ handleCloseModal }: { handleCloseModal: () => void }) {
  const [loading, setToaster, setLoading] = useGlobalStore((state) => [
    state.loading,
    state.setToaster,
    state.setLoading
  ])
  const [updateUser, setCurrentUser] = useMainStore((state) => [
    state.updateUser,
    state.setCurrentUser
  ])
  const [user, setUser] = useAuthStore((state) => [
    // @ts-ignore
    state.user,
    // @ts-ignore
    state.setUser
  ])

  const [imageUrl, setImageUrl] = useState<string | null>(user.imageUrl)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const { uploadFiles } = useUpload()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user.name
    }
  })

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target?.files

    try {
      setLoading(true)

      const mediaFiles = await uploadFiles(files)
      mediaFiles && setImageUrl(mediaFiles[0].url)
    } catch (error) {
      setToaster({
        isOpen: true,
        message: 'Error ao carregar imagem',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfiguration = (data: IFormValues) => {
    const { name, password } = data

    const newData = {
      name,
      imageUrl: imageUrl || user.imageUrl || null
    }

    if (password) {
      Object.assign(newData, { password })
    }

    updateUser(String(user!.id), newData)
    Object.assign(newData, user)

    setCurrentUser(newData as any)
    setShowSuccess(true)
    setUser({ ...user, imageUrl, name })
    reset({ name: '', password: '', newPassword: '' })
    setImageUrl(null)
  }

  const handleReset = () => {
    setImageUrl(user.imageUrl)
    setShowSuccess(false)
  }

  const resetAndClose = () => {
    handleReset()
    handleCloseModal()
  }

  return (
    <ModalCustom title="Configurações de usuário" closeModal={resetAndClose}>
      <form onSubmit={handleSubmit(handleSaveConfiguration)}>
        {!showSuccess && (
          <div>
            <TextField
              label="Nome do usuário"
              type="text"
              sx={{ width: '100%', mt: 2 }}
              {...register('name')}
            />
            {errors.name && (
              <span className=" text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}

            <TextField
              variant="outlined"
              label="Nova senha"
              type={showPassword ? 'text' : 'password'}
              sx={{ width: '100%', mt: 2 }}
              {...register('password')}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            {errors.password && (
              <span className=" text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}

            <TextField
              variant="outlined"
              label="Confirme sua senha"
              type={showPassword ? 'text' : 'password'}
              sx={{ width: '100%', mt: 2 }}
              {...register('newPassword')}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            {errors.newPassword && (
              <span className=" text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
              height="170px"
            >
              {!imageUrl && !loading && (
                <Uploader
                  label="Foto de perfil: "
                  uploadFile={uploadFile}
                  type="image"
                />
              )}

              <div className="relative m-auto my-2">
                {loading && (
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={150}
                    sx={{
                      borderRadius: '8px',
                      mt: 2,
                      mb: 2
                    }}
                  />
                )}

                {!loading && !!imageUrl && (
                  <>
                    <IconButton
                      style={{ zIndex: 1 }}
                      className="absolute right-0 top-0 m-1 hover:bg-red-500 hover:text-white"
                      onClick={() => setImageUrl(null)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                    <Image
                      src={imageUrl}
                      alt={`Foto de perfil do usuário ${user.name}`}
                      width={840}
                      height={360}
                      style={{
                        maxHeight: '150px',
                        width: 'auto',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                  </>
                )}
              </div>
            </Box>

            <Button
              variant="contained"
              type="submit"
              sx={{ width: '100%', mt: 2 }}
            >
              Salvar
            </Button>
          </div>
        )}
      </form>

      {!loading && showSuccess && <SuccessAction />}
    </ModalCustom>
  )
}

export default UserSettings
