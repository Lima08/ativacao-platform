import { useContext } from 'react'
import { CampaignsContext } from '../../../context'
import ListItem from 'components/ListItem'

type ListWrapperProps = {
  pageTitle: string
}

function ListWrapper2({ pageTitle }: ListWrapperProps) {
  const { state } = useContext(CampaignsContext)

  return (
    <section className="w-[90%] container px-4 mx-auto">
      {/*Wrapper header*/}
      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Busca por título"
            className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            disabled={false}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>Anterior</span>
          </button>

          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>Próximo</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/*Wrapper main*/}
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {state && state.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center flex-col">
                          {/*Empty wrapper condition*/}
                          {pageTitle === 'campanha'
                            ? `Nenhuma ${pageTitle} adicionada.`
                            : `Nenhum ${pageTitle} adicionado.`}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    state &&
                    state.map((el) => (
                      <ListItem
                        key={el.elementId}
                        elementId={el.elementId}
                        itemTitle={el.itemTitle}
                        itemDescription={el.itemDescription}
                      />
                    ))
                  )}

                  {/* <tr>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center flex-col">
                        <img
                          className="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full dark:border-gray-700"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                          alt=""
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div>
                        <h2 className="font-medium text-gray-800 dark:text-white ">
                          Catalog
                        </h2>
                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          catalogapp.io
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div>
                        <h4 className="text-gray-700 dark:text-gray-200">
                          Content curating app
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          Brings all your news into one place
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center flex-col">
                        <img
                          className="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full dark:border-gray-700"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                          alt=""
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div>
                        <h2 className="font-medium text-gray-800 dark:text-white ">
                          Circooles
                        </h2>
                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          getcirooles.com
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div>
                        <h4 className="text-gray-700 dark:text-gray-200">
                          Design software
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          Super lightweight design app
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <button className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/*Wrapper footer*/}
      <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Página{' '}
          <span className="font-medium text-gray-700 dark:text-gray-100">
            1 de 1
          </span>
        </div>
      </div>
    </section>
  )
}

export default ListWrapper2
