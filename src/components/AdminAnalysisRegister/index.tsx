import { Dispatch, SetStateAction, useState } from 'react'

import useGlobalStore from 'store/useGlobalStore'
import useMainStore from 'store/useMainStore'

// type dataProps = {
//   id: string
//   status: string
//   date: string
//   message?: string | undefined
//   title: string
//   bucketUrl: string
//   biUrl: string
//   setClose: () => Dispatch<SetStateAction<boolean>>
// }

export default function AdminAnalysisRegister({ analysis, setClose }: any) {
  const [setToaster] = useGlobalStore((state) => [state.setToaster])
  const [done, reject] = useMainStore((state) => [state.done, state.reject])

  const [linkBI, setLinkBI] = useState(analysis.biUrl || '')
  const [comments, setComments] = useState(analysis.message || '')
  const [status, setStatus] = useState('done')

  const handleInputs = (e: string, cb?: Dispatch<SetStateAction<string>>) => {
    if (cb) cb(e)
  }

  // const router = useRouter()

  const handlSubmit = () => {
    if (comments && status) {
      if (status === 'done') {
        done(analysis.id, comments)
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
        {/* URL do BI*/}
        <div className="flex flex-col items-start mb-2">
          <label htmlFor="BIURL" className="text-left">
            Link do BI:{' '}
          </label>
          <input
            type="text"
            name=""
            id="BIURL"
            value={linkBI}
            className="py-2 my-2 rounded-md w-full drop-shadow-md"
            onChange={(e) =>
              handleInputs((e.target as HTMLInputElement).value, setLinkBI)
            }
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
            value={comments}
            className="my-2 rounded-md h-2/4 w-full drop-shadow-md"
            onChange={(e) =>
              handleInputs((e.target as HTMLTextAreaElement).value, setComments)
            }
          />
        </div>
        <div className="py-2 mt-4 mb-2 w-full flex gap-4 items-baseline justify-center">
          <select
            name=""
            id=""
            className="mb-2 py-3 rounded-md"
            onClick={(e) =>
              handleInputs((e.target as HTMLSelectElement).value, setStatus)
            }
          >
            <option value="done">Aprovar</option>
            <option value="rejected">Rejeitar</option>
          </select>
          <button
            onClick={() => handlSubmit()}
            className={
              `flex items-center justify-center w-1/2 px-5 py-3 text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800`
              // ${
              //   analysis.status === 'pending'
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
