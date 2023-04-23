import { useContext } from 'react'
import { CampaignsContext } from '../../../context'

type ListItemProps = {
  elementId: number
  itemTitle: string
  itemDescription: string
  imgSource?: string
  imgAlt?: string
}

const imgSrc =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'

function ListItem({
  elementId,
  itemTitle = 'Campaign title',
  itemDescription = 'Campaign description',
  imgSource = imgSrc,
  imgAlt = 'Campaign image'
}: ListItemProps) {
  const { state, setState } = useContext(CampaignsContext)

  function remove(value: any) {
    const userDecision = confirm('Confirmar deleção?')
    if (!userDecision) return

    const nextState = state.filter(
      (element) => String(element.elementId) !== value.id
    )

    setState(nextState)
  }

  return (
    <tr>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center flex-col">
          <img
            className="object-cover w-12 h-12 -mx-1 border-2 border-white rounded-full dark:border-gray-700"
            src={imgSource}
            alt={imgAlt}
          />
        </div>
      </td>

      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
        <div>
          <h2 className="font-medium text-gray-800 dark:text-white ">
            {itemTitle}
          </h2>
          {/* <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
            secondary title
          </p> */}
        </div>
      </td>

      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div>
          <h4 className="text-gray-700 dark:text-gray-200">
            {itemDescription}
          </h4>
          {/* <p className="text-gray-500 dark:text-gray-400">
            secondary description
          </p> */}
        </div>
      </td>

      <td className="px-4 py-4 text-sm whitespace-nowrap flex items-center justify-evenly">
        {/* <button
          className="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
          onClick={handleClick}
        >
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
        </button> */}
        <div className="rounded px-1 py-1 text-gray-500 flex w-[40%] gap-2 flex-grow-[2]">
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 disabled">
            Editar
          </button>
          <button
            id={`${elementId}`}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm hover:text-gray-100 border-red-600 text-gray-700 capitalize transition-colors duration-200 hover:bg-red-600 border rounded-md sm:w-auto gap-x-2  dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={(e) => remove(e.currentTarget)}
          >
            Deletar
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ListItem
