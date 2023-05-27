'use client'

import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import { PhotoIcon } from '@heroicons/react/24/solid'
import {
  Avatar,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField
} from '@mui/material'
import { ROLES } from 'constants/enums/eRoles'
import { IUserModifier } from 'interfaces/entities/user'
import httpServices from 'services/http'
import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'
import DashboardLayout from 'wrappers/DashboardLayout'

import ToggleInput from 'components/ToggleInput'

export default function RegisterUser() {
  const router = useRouter()
  const userId = router.query.id

  const [loading, setToaster] = useGlobalStore((state) => [
    state.loading,
    state.setToaster
  ])
  const [currentUser, getUserById, resetCurrentUser, updateUser] = useMainStore(
    (state) => [
      state.currentUser,
      state.getUserById,
      state.resetCurrentUser,
      state.updateUser
    ]
  )

  const [name, setName] = useState('')
  const [newPassWord, setNewPassWord] = useState<string | null>(null)
  const [confirmedPassword, setConfirmedPassword] = useState<string | null>(
    null
  )
  const [activeStatus, setActiveStatus] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  const uploadFile = async (e: any) => {
    e.preventDefault()
    const files = e.target?.files

    if (!files.length) return

    if (files[0].type.split('/')[0] !== 'image') {
      setToaster({
        isOpen: true,
        message: 'Formato de arquivo inválido!',
        type: 'warning'
      })
      return
    }

    const formData = new FormData()
    formData.append('files', files[0])

    try {
      setLoadingData(true)
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

  const handleSubmit = () => {
    const updatedUserData: IUserModifier = {
      name,
      isActive: activeStatus,
      role: isAdmin ? ROLES.COMPANY_ADMIN : ROLES.DEFAULT_USER
    }

    if (newPassWord) {
      if (newPassWord !== confirmedPassword) {
        setToaster({
          isOpen: true,
          message: 'As senhas não coincidem!',
          type: 'warning'
        })
        return
      }

      updatedUserData.password = newPassWord
    }

    if (imageUrl.length > 0) updatedUserData.imageUrl = imageUrl
    updateUser(String(userId), updatedUserData)
  }

  useEffect(() => {
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
    const defineAdmin = Number(role) >= ROLES.COMPANY_ADMIN
    setIsAdmin(defineAdmin)
  }, [currentUser])

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(event.target.checked)
  }
  return (
    <DashboardLayout>
      <Card
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          p: 2
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

          <ToggleInput
            toggleId={currentUser?.id || ''}
            defaultActive={activeStatus}
            onClickToggle={() => setActiveStatus(!activeStatus)}
          />
        </Stack>
        <div className="flex flex-col gap-2 ">
          <TextField
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Nova senha"
            value={newPassWord}
            onChange={(e) => setNewPassWord(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Confirme sua senha"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox checked={isAdmin} onChange={handleCheckboxChange} />
            }
            label="Administrador"
          />
        </div>
        <div className="mt-6 hover:bg-gray-100">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25   hover:border-blue-500 py-6">
              {loadingData && <CircularProgress />}
              {!loadingData && (
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple={false}
                      disabled={loading}
                      onChange={(e) => uploadFile(e)}
                    />
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG e JPEG, até 10MB
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
        {loading && (
          <div className="w-full flex justify-center align-middle px-3 py-2">
            <CircularProgress />
          </div>
        )}

        {!loading && (
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-600 px-3 py-2 mt-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Salvar
          </button>
        )}
      </Card>
    </DashboardLayout>
  )
}
