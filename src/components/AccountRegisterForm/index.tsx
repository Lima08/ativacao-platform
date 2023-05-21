import { LockClosedIcon } from '@heroicons/react/24/solid'

export default function LoginForm() {
  async function handleSignIn(data: any) {
    console.log('🚀 ~ file: index.tsx:12 ~ handleSignIn ~ data:', data)
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
      <form className="mt-8 space-y-6 w-64 md:w-80" onSubmit={handleSignIn}>
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
              name="company"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Empresa"
            />
          </div>
          <div>
            <label htmlFor="user-name" className="sr-only">
              Nome
            </label>
            <input
              id="user-name"
              name="user-name"
              type="text"
              autoComplete="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nome"
            />
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="senha"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Criar
          </button>
        </div>
      </form>
      {/* TODO: Adicionar mensagem dizendo que a solicitação foi enviada com sucesso. Você receberá um e-mail informando assim que o administrador da conta liberar seu acesso. */}
      {/* OU: Erro ao criar conta. Entre em contato com o administrador */}
    </div>
  )
}
