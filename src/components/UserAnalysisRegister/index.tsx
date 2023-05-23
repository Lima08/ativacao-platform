export default function UserAnalysisRegister() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-2 bg-gray-600 rounded-b-md w-2/4 text-white text-center">
        <h1>Nova solicitação</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-2 mt-4">
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="title" className="text-left">
            Título:{' '}
          </label>
          <input
            type="text"
            name=""
            id="title"
            className="py-2 my-2 rounded-md w-full drop-shadow-md"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label htmlFor="spreadsheet" className="text-left">
            Planilha:{' '}
          </label>
          <div className="mt-2 mx-auto w-full flex justify-center rounded-lg border border-dashed border-gray-900/25 px-12 py-2">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                />
              </svg>

              <div className="mt-2 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Subir arquivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple={true}
                    // disabled={loading || isFetching}
                    // onChange={(e) => uploadFile(e)}
                  />
                </label>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                .xlsx de até 10MB
              </p>
            </div>
          </div>
        </div>
        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <button
            // onClick={() => {
            // }}
            className={
              `flex items-center justify-center w-1/2 px-5 py-3 text-gray-700 capitalize transition-colors duration-200 bg-white border border-grey-500 hover:bg-gray-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800`
              // ${
              //   data.status === 'pending'
              //     ? 'pointer-events-none border-gray-200 op-50'
              //     : ''
              // }`
            }
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}