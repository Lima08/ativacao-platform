import { ReactNode, useState } from 'react'

import Modal from 'components/CustomModal'

export type AnalyzesDataList = {
  id: string
  title: string
  bucketUrl: string
  biUrl?: string
  status: string
  message?: string | undefined
}

type ListItemProps = {
  data: AnalyzesDataList
  onDelete: (id: string) => void
}

const STATUS: { [key: string]: ReactNode } = {
  pending: (
    <span className="flex w-6 h-6 bg-yellow-500 rounded-full text-center text-sm text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>
  ),
  done: (
    <span className="flex w-6 h-6 bg-green-500 rounded-full text-center text-sm text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>
  ),
  rejected: (
    <span className="flex w-6 h-6 bg-red-500 rounded-full text-center text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </span>
  )
}

export default function ListAnalyzesItem({ data, onDelete }: ListItemProps) {
  const [open, setOpen] = useState(false)

  console.log('data', data)

  return (
    <div className="flex flex-col items-center w-full dark:border-gray-700 rounded-md">
      <div className="flex px-4 py-4 justify-center gap-4 items-center w-full">
        <button
          className={`w-1/4 flex justify-around items-center border border-gray-200 rounded-md p-1 bg-white`}
          // className={`w-1/4 flex justify-around items-center border border-gray-200 rounded-md p-1 bg-white ${
          //   data.status === 'pending' ? 'op-50 pointer-events-none' : ''
          // }`}
          onClick={() => setOpen(!open)}
        >
          {STATUS[data.status]}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="grey"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        <div className="font-medium text-slate-500 w-1/4">01/01/2022</div>
        <h2 className="font-medium text-gray-800 dark:text-white w-1/2">
          {data.title}
        </h2>
        <div className="px-4 py-4 flex gap-6 justify-evenly">
          {/* <a
            href={data?.biUrl}
            className={`${
              data.status === 'pending' ? 'pointer-events-none' : ''
            }`}
          > */}
          <button
            onClick={(event) => {
              event.stopPropagation()
              window.location.href = data.biUrl || ''
            }}
            className={`flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
              data.status === 'pending'
                ? 'pointer-events-none border-gray-200 op-50'
                : ''
            }`}
          >
            Visualizar
          </button>
          {/* </a> */}
          <button
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm hover:text-gray-100 border-red-600 text-gray-700 capitalize transition-colors duration-200 hover:bg-red-600 border rounded-md sm:w-auto gap-x-2  dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(data.id)
            }}
          >
            Deletar
          </button>
        </div>
      </div>
      {open && (
        <Modal size="w-[400px] h-[400px]" open={open} setOpen={setOpen}>
          <div className="m-auto py-5 px-6">
            <h1 className="font-bold text-lg bg-blue-500 text-white rounded-t-md">
              {data.title}
            </h1>
            <p className="py-2 uppercase bg-gray-100 text-sm rounded-b-md">
              comentários
            </p>
            <p className="py-2 mt-2">{data.message || 'Sem comentários.'}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
