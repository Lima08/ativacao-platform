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

export default function ListAnalyzesItem({ data }: ListItemProps) {
  return (
    <div className="flex px-4 py-4 justify-center gap-4 items-center w-full">
      <h2 className="font-medium text-gray-800 dark:text-white w-1/2">
        {data.title}
      </h2>
      <div className="font-medium text-slate-500 w-1/4">01/01/2022</div>
      <div className="w-1/4 flex justify-end">{STATUS[data.status]}</div>
    </div>
  )
}
