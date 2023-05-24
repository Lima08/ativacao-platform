import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

import { ROLES } from 'constants/enums/eRoles'
import { useAuthStore } from 'store/useAuthStore'

import CustomModal from 'components/CustomModal'

import { formatDate } from '../../../utils'

export type AnalyzesDataList = {
  id: string
  title: string
  bucketUrl: string
  biUrl?: string
  status: string
  date: string
  message?: string | undefined
}

type ListItemProps = {
  data: AnalyzesDataList
  onDelete: (id: string) => void
  setEditAnalysis: Dispatch<SetStateAction<boolean>>
  editAnalysis: boolean
  setAnalysisId: Dispatch<SetStateAction<string>>
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

export default function ListAnalyzesItem({
  data,
  onDelete,
  editAnalysis,
  setEditAnalysis,
  setAnalysisId
}: ListItemProps) {
  const [openStatus, setOpenStatus] = useState(false)
  const [systemAdmin, setIsSystemAdmin] = useState(false)
  // @ts-ignore
  const role = useAuthStore((state) => state.user?.role)

  useEffect(() => {
    setIsSystemAdmin(role >= ROLES.SYSTEM_ADMIN)
  }, [role])

  return (
    <div className="flex flex-col items-center w-full dark:border-gray-700 rounded-md">
      <div className="flex px-4 py-4 justify-center gap-4 items-center w-full">
        <button
          className={`w-1/4 flex justify-around items-center border border-gray-200 rounded-md p-1 bg-white`}
          // className={`w-1/4 flex justify-around items-center border border-gray-200 rounded-md p-1 bg-white ${
          //   data.status === 'pending' ? 'op-50 pointer-events-none' : ''
          // }`}
          onClick={() => setOpenStatus(!openStatus)}
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
        <div className="font-medium text-slate-500 w-1/4">
          {formatDate(data.date)}
        </div>
        <h2
          className={`font-medium text-gray-800 dark:text-white w-1/2 ${
            systemAdmin ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            if (systemAdmin) {
              setAnalysisId(data.id)
              setEditAnalysis(!editAnalysis)
            }
          }}
        >
          {data.title}
        </h2>
        <div className="px-4 py-4 flex gap-6 justify-evenly">
          <button
            onClick={(event) => {
              event.stopPropagation()
            }}
            disabled={!data.bucketUrl}
            className={`flex items-center justify-center w-1/2 h-1/3 px-5 py-2 text-gray-700 capitalize transition-colors duration-200 bg-white border border-blue-500 hover:bg-blue-600 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800`}
          >
            <a href={data.bucketUrl || ''}>Baixar</a>
          </button>
          <button
            disabled={!data.biUrl}
            className={`flex items-center justify-center w-1/2 h-1/3 px-5 py-2 text-gray-700 capitalize transition-colors duration-200 bg-white border hover:bg-green-500 hover:text-white rounded-md sm:w-auto gap-x-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
              data.status === 'pending' ||
              data.status === 'rejected' ||
              !data.biUrl
                ? 'border-gray-200 pointer-events-none op-50'
                : 'border-green-500'
            }`}
          >
            <a href={data.biUrl || ''} target="_blank" rel="noreferrer">
              BI
            </a>
          </button>
          <button
            className="flex items-center justify-center w-1/2 h-1/3 px-5 py-2 hover:text-gray-100 border-red-600 text-gray-700 capitalize transition-colors duration-200 hover:bg-red-600 border rounded-md sm:w-auto gap-x-2  dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(data.id)
            }}
          >
            Deletar
          </button>
        </div>
      </div>
      {openStatus && (
        <CustomModal
          size="w-[400px] h-[400px]"
          open={openStatus}
          setOpen={setOpenStatus}
        >
          <div className="m-auto py-5 px-6">
            <h1 className="font-bold text-lg bg-blue-500 text-white rounded-t-md">
              {data.title}
            </h1>
            <p className="py-2 uppercase bg-gray-100 text-sm rounded-b-md">
              comentários
            </p>
            <p className="py-2 mt-2">{data.message || 'Sem comentários.'}</p>
          </div>
        </CustomModal>
      )}
    </div>
  )
}
