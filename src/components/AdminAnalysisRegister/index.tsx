import { useState } from 'react'

import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

export default function AdminAnalysisRegister({ analysis, setClose }: any) {
  const [setToaster] = useGlobalStore((state) => [state.setToaster])
  const [done, reject] = useMainStore((state) => [state.done, state.reject])

  const [linkBI, setLinkBI] = useState(analysis.biUrl || '')
  const [comments, setComments] = useState(analysis.message || '')
  const [status, setStatus] = useState('done')

  const handleSubmit = async () => {
    if (comments && status) {
      if (status === 'done') {
        done(analysis.id, { biUrl: linkBI, message: comments })
      } else {
        reject(analysis.id, comments)
      }
    }
    setToaster({
      isOpen: true,
      type: 'success',
      message: 'Análise concluída com sucesso'
    })

    setClose()
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="py-2 bg-blue-600 rounded-b-md w-2/4 text-white text-center">
        <h1>{analysis.title}</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-2 mt-4">
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="BIURL" className="text-left">
            Link do BI:
          </label>
          <input
            type="text"
            name=""
            id="BIURL"
            value={linkBI}
            className="py-2 my-2 rounded-md w-full drop-shadow-md"
            onChange={(e) => setLinkBI(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label htmlFor="message" className="text-left">
            Mensagem:
          </label>
          <textarea
            id="message"
            value={comments}
            className="my-2 rounded-md h-2/4 w-full drop-shadow-md"
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <select
            className="mb-2 py-3 rounded-md"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="done">Aprovar</option>
            <option value="rejected">Rejeitar</option>
          </select>
          <button
            onClick={handleSubmit}
            className={`flex items-center justify-center w-1/2 px-5 py-3 text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800`}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}
