import { ReactNode } from 'react'

export type AnalyzesDataList = {
  id: string
  title: string
  bucketUrl: string
  biUrl?: string
  status: string
}

type ListItemProps = {
  data: AnalyzesDataList
  onDelete: (id: string) => void
}

const STATUS: { [key: string]: ReactNode } = {
  pending: (
    <span className="flex w-6 h-6 bg-gray-200 rounded-full text-center text-sm text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
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
          d="M4.5 12.75l6 6 9-13.5"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
  )
}

export default function ListAnalyzesItem({ data, onDelete }: ListItemProps) {
  return (
    <div className="flex px-4 py-4 justify-center gap-4 items-center w-full">
      <div className="w-1/4 flex justify-end">{STATUS[data.status]}</div>
      <div className="font-medium text-slate-500 w-1/4">01/01/2022</div>
      <h2 className="font-medium text-gray-800 dark:text-white w-1/2">
        {data.title}
      </h2>
      <div className="px-4 py-4 flex gap-6 justify-evenly">
        <button
          onClick={(event) => {
            event.stopPropagation()
          }}
          className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Visualizar
        </button>
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
  )
}
