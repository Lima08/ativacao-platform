import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, CircularProgress } from '@mui/material'
import httpServices from 'services/http'

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

  const [isLoading, setIsLoading] = useState(false)
  const [errorToCreate, setIsErrorToCreate] = useState(false)
  const [creteSuccess, setCreteSuccess] = useState(false)

  async function createAccount(values: IFormValues) {
    setIsErrorToCreate(false)
    setCreteSuccess(false)
    try {
      setIsLoading(true)

      await httpServices.user.create(values)
      setCreteSuccess(true)
    } catch {
      setIsErrorToCreate(true)
    } finally {
      setIsLoading(false)
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
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="company" className="sr-only">
              Empresa
            </label>
            <input
              id="company"
              type="text"
              {...register('companyId')}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Empresa"
              required
            />
            {errors.companyId && (
              <span className=" text-red-500 text-sm">
                {errors.companyId.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="user-name" className="sr-only">
              Nome
            </label>
            <input
              id="user-name"
              type="text"
              {...register('name')}
              autoComplete="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nome"
            />
            {errors.name && (
              <span className=" text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
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

        {!isLoading && !creteSuccess && (
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar
            </button>
            {isLoading && <CircularProgress />}
          </div>
        )}
        {!isLoading && creteSuccess && (
          <>
            <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium border-solid rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Link href="/login">Entrar</Link>
            </button>
            <Alert severity="success">
              Solicitação enviada com sucesso! Aguarde e-mail de confirmação.
            </Alert>
          </>
        )}
        {!isLoading && errorToCreate && (
          <Alert severity="error">Não foi possível criar sua conta!</Alert>
        )}
      </form>
    </div>
  )
}
