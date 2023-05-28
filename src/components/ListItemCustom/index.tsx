// DEPRECATED
import { useEffect, useState } from 'react'

import { ROLES } from 'constants/enums/eRoles'
import { IAuthStore, useAuthStore } from 'store/useAuthStore'

import ToggleInput from 'components/ToggleInput'

export type DataList = {
  id: string
  name: string
  description: string | null
  img: { source: string; alt: string }
  active: boolean
}

type ListItemProps = {
  data: DataList
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onClickRow: (id: string) => void
  onClickToggle: (id: string, active: boolean) => void
}

export default function ListItemCustom({
  data,
  onClickRow,
  onClickToggle,
  onEdit,
  onDelete
}: ListItemProps) {
  const { user } = useAuthStore((state) => state) as IAuthStore

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) return
    setIsAdmin(user.role >= ROLES.COMPANY_ADMIN)
  }, [user])
  return (
    <li
      key={data.id}
      className="flex md:gap-10 hover:bg-slate-100 bg-white hover:cursor-pointer w-full border rounded max-h-18"
      onClick={() => onClickRow(data.id)}
    >
      <div className="flex justify-evenly">
        <div className="px-4 py-4 text-sm whitespace-nowrap">
          <div className="flex items-center flex-col">
            <img
              className="object-fill w-14 h-12 -mx-1 rounded"
              src={data.img.source}
              alt={data.img.alt}
            />
          </div>
        </div>
        <div className="px-4 py-4 text-sm font-medium items-center w-40 md:w-80 hidden sm:flex justify-start">
          <h2 className="font-medium text-gray-800 dark:text-white">
            {data.name}
          </h2>
        </div>
        
      </div>

      {isAdmin && (
        <div className="px-4 py-4 flex gap-6 justify-evenly">
          <ToggleInput
            toggleId={data.id}
            defaultActive={data.active}
            onClickToggle={onClickToggle}
          />
          <button
            onClick={(event) => {
              event.stopPropagation()
              onEdit(data.id)
            }}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 disabled"
          >
            Editar
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
      )}
    </li>
  )
}
