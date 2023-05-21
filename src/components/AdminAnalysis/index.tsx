export default function AdminAnalysis() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-2 bg-blue-600 rounded-b-md w-2/4 text-white text-center">
        <h1>Análise</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-2 mt-4">
        {/* URL do BI*/}
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="BIURL" className="text-left">
            Link do BI:{' '}
          </label>
          <input
            type="text"
            name=""
            id="BIURL"
            className="py-2 my-2 rounded-md w-full drop-shadow-md"
          />
        </div>
        {/* mensagem*/}
        <div className="flex flex-col items-start w-full">
          <label htmlFor="message" className="text-left">
            Mensagem:{' '}
          </label>
          <textarea
            name=""
            id="message"
            className="my-2 rounded-md h-2/4 w-full drop-shadow-md"
          />
        </div>
        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <select name="" id="" className="mb-2 py-3 rounded-md">
            <option value="">Aprovar</option>
            <option value="">Rejeitar</option>
          </select>
          <button
            onClick={() => {
              // window.location.href = data.biUrl || ''
            }}
            className={
              `flex items-center justify-center w-1/2 px-5 py-3 text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800`
              // ${
              //   data.status === 'pending'
              //     ? 'pointer-events-none border-gray-200 op-50'
              //     : ''
              // }`
            }
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}
