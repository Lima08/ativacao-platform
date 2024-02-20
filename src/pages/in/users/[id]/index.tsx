'use client'

import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Stack,
  TextField
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IUserModifier } from 'interfaces/entities/user'
import httpServices from 'services/http'
import { useAuthStore } from 'store/useAuthStore'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

import LoadingScreen from 'components/LoadingScreen'
import ToggleInput from 'components/ToggleInput'
import Uploader from 'components/Uploader'

export default function RegisterUser() {
  const router = useRouter()
  let userId = ''
  if (router.isReady) {
    userId = String(router.query.id)
  }

  const [setToaster, loading, error, setError] = useGlobalStore((state) => [
    state.setToaster,
    state.loading,
    state.error,
    state.setError
  ])
  const [user, setUser] = useAuthStore((state: any) => [
    state.user,
    state.setUser
  ])
  const [
    currentUser,
    getUserById,
    resetCurrentUser,
    updateUser,
    setCurrentUser
  ] = useMainStore((state) => [
    state.currentUser,
    state.getUserById,
    state.resetCurrentUser,
    state.updateUser,
    state.setCurrentUser
  ])

  const [loggedUser, setLoggedUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [newPassWord, setNewPassWord] = useState<string>('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [activeStatus, setActiveStatus] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSystemAdmin, setIsSystemAdmin] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target?.files

    if (!files.length) return

    if (files[0].type.split('/')[0] !== 'image') {
      setToaster({
        isOpen: true,
        message: 'Formato de arquivo inválido! Por favor forneça uma imagem',
        type: 'warning'
      })
      return
    }

    const formData = new FormData()
    formData.append('files', files[0])

    try {
      setLoadingData(true)
      setError(null)
      const { data, error } = await httpServices.upload.save(formData)

      if (!!error || !data) {
        setToaster({
          isOpen: true,
          message: 'Error ao salvar imagem',
          type: 'error'
        })
        return
      }

      setImageUrl(data[0].url)
    } catch (error) {
      setToaster({
        isOpen: true,
        message: 'Error ao carregar imagem',
        type: 'error'
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleUpdateForm = () => {
    const updatedUserData: IUserModifier = {
      name,
      isActive: activeStatus,
      imageUrl
    }

    if (isAdmin) {
      updatedUserData.role = ROLES.COMPANY_ADMIN
    } else if (isSystemAdmin) {
      updatedUserData.role = ROLES.SYSTEM_ADMIN
    } else {
      updatedUserData.role = ROLES.DEFAULT_USER
    }

    if (isSystemAdmin) {
      updatedUserData.role = ROLES.SYSTEM_ADMIN
    }

    if (newPassWord.length) {
      if (newPassWord !== confirmedPassword) {
        setNewPassWord('')
        setConfirmedPassword('')
        setToaster({
          isOpen: true,
          message: 'As senhas não coincidem!',
          type: 'warning'
        })
        return
      }

      updatedUserData.password = newPassWord
    }

    updateUser(String(userId), updatedUserData)
    if (userId === user.id) setUser({ ...user, name, imageUrl })
    setNewPassWord('')
    setConfirmedPassword('')
    if (error) return
    router.push('/in/users/')
  }

  const onActiveChange = (status: boolean) => {
    setActiveStatus(status)
    setHasChanges(true)
  }

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setHasChanges(true)
  }

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassWord(e.target.value)
    setHasChanges(true)
  }

  const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmedPassword(e.target.value)
    setHasChanges(true)
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(event.target.checked)
    setHasChanges(true)
  }

  const updateProfileImage = () => {
    updateUser(String(userId), { ...currentUser, imageUrl })
    if (userId === user.id) setUser({ ...user, name, imageUrl })
    router.push('/in/users/')
  }

  useEffect(() => {
    if (!userId) return
    getUserById(String(userId))

    return () => {
      resetCurrentUser()
    }
  }, [userId, getUserById, resetCurrentUser])

  useEffect(() => {
    if (!currentUser) return

    const { isActive, name, imageUrl, role } = currentUser

    setName(name)
    setActiveStatus(isActive)
    setImageUrl(imageUrl || '')

    const defineAdmin =
      Number(role) >= ROLES.COMPANY_ADMIN && Number(role) < ROLES.SYSTEM_ADMIN
    setIsAdmin(defineAdmin)

    const defineSystemAdmin = Number(role) >= ROLES.SYSTEM_ADMIN
    setIsSystemAdmin(defineSystemAdmin)
  }, [currentUser])

  useEffect(() => {
    if (!user) return
    setLoggedUser(user)
  }, [user, setCurrentUser])

  if (loggedUser?.role < (currentUser?.role as number)) {
    return (
      <div className="m-4">Você não tem permissão para ver esta página.</div>
    )
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          p: 2,
          mb: 2
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, minWidth: 500 }}
        >
          <div>
            <Avatar
              src={imageUrl}
              sx={{ width: 80, height: 80, alignSelf: 'center' }}
            />
            {currentUser && <p className="my-2">{currentUser?.email}</p>}
          </div>

          {loggedUser && loggedUser.role >= (currentUser?.role as number) && (
            <ToggleInput
              toggleId={currentUser?.id || ''}
              defaultActive={activeStatus}
              onClickToggle={() => onActiveChange(!activeStatus)}
            />
          )}
        </Stack>

        <div className="flex flex-col gap-4 ">
          <TextField
            variant="outlined"
            label="Nome"
            value={name}
            onChange={onNameChange}
          />
          <TextField
            variant="outlined"
            label="Nova senha"
            type={showPassword ? 'text' : 'password'}
            value={newPassWord}
            onChange={onPasswordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />
          <TextField
            variant="outlined"
            label="Confirme sua senha"
            type={showPassword ? 'text' : 'password'}
            value={confirmedPassword}
            onChange={onConfirmPasswordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />

          {loggedUser &&
            loggedUser.role >= ROLES.COMPANY_ADMIN &&
            currentUser &&
            currentUser.role <= ROLES.COMPANY_ADMIN && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={handleCheckboxChange}
                    color="default"
                  />
                }
                label="Administrador"
              />
            )}
        </div>

        <div className="mt-4 mb-4">
          {!loading && (
            <Button
              type="submit"
              onClick={handleUpdateForm}
              variant="contained"
              fullWidth
              disabled={!hasChanges}
            >
              Salvar
            </Button>
          )}
        </div>
      </Card>

      <Card
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          p: 2
        }}
      >
        <>
          {!loadingData && (
            <Uploader uploadFile={uploadFile} label="Foto de perfil:" />
          )}
          {loadingData && (
            <div className="w-full flex justify-center align-middle px-3 py-2">
              <CircularProgress />
            </div>
          )}
        </>

        <div className="mt-2 mb-2">
          {!loading && (
            <Button
              type="submit"
              onClick={updateProfileImage}
              variant="contained"
              fullWidth
              disabled={imageUrl === currentUser?.imageUrl || loading}
            >
              Salvar
            </Button>
          )}
        </div>
        {loading && <LoadingScreen />}
      </Card>
    </>
  )
}
