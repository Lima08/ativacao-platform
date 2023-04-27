import { useState } from 'react'
import Modal from 'components/MediaViewer'
import ToggleInput from 'components/ToggleInput'
import CustomButton from 'components/CustomButton'

type TableWrapperProps = {
  data: any[]
  setData: any
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  toggleActivation?: (id: string) => void
}

const images = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&crop&w=215&q=80'
]

export default function TableWrapper({
  data,
  setData,
  onDelete,
  onEdit,
  toggleActivation
}: TableWrapperProps) {
  // const [localData, setLocalData] = useState(data)
  const [itemView, setItemView] = useState<{
    name: string
    description: string
  }>()
  const [open, setOpen] = useState(true)

  // function remove(value: any) {
  //   const userDecision = confirm('Confirmar deleção?')
  //   if (!userDecision) return

  //   const nextState = data.filter(
  //     (element: any) => String(element.id) !== value.id
  //   )

  //   setData(nextState)
  // }

  function openMediaViewer(value: any) {
    const element = data.find((element: any) => element.id === value.id)
    if (element) setItemView(element)

    setOpen(true)
  }

  return (
    <section className="w-full mx-auto">
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className=" divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl">
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {data && !data.length && (
                    <tr className="hover:bg-slate-100 bg-white rounded-full">
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center flex-col">
                          Nenhuma campanha adicionada.
                        </div>
                      </td>
                    </tr>
                  )}
                  {!!data.length &&
                    data.map(({ id, name, description, active }: any) => {
                      const imgSource =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
                      const imgAlt = 'Imagem da campanha'
                      return (
                        <tr
                          key={id}
                          className="hover:bg-slate-100 bg-white rounded-full"
                        >
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center flex-col">
                              <img
                                className="object-cover w-14 h-12 -mx-1 border-2 border-white rounded-full dark:border-gray-700"
                                src={imgSource}
                                alt={imgAlt}
                              />
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                            {itemView && (
                              <Modal
                                title={itemView.name}
                                description={itemView.description}
                                imageSource={imgSource}
                                medias={images}
                                open={open}
                                setOpen={setOpen}
                              />
                            )}
                            <div>
                              <a
                                href="#"
                                id={`${id}`}
                                onClick={(e) =>
                                  openMediaViewer(e.currentTarget)
                                }
                              >
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                  {name}
                                </h2>
                              </a>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div>
                              <h4 className="text-gray-700 dark:text-gray-200">
                                {description}
                              </h4>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap flex items-center justify-evenly">
                            <div className="rounded px-1 py-1 text-gray-500 flex w-[40%] gap-2 flex-grow-[2]">
                              {!!toggleActivation && (
                                <ToggleInput
                                  defaultActive={active}
                                  onToggle={() => toggleActivation(id)}
                                />
                              )}
                              {!!onEdit && (
                                <button
                                  onClick={() => onEdit(id)}
                                  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 disabled"
                                >
                                  Editar
                                </button>
                              )}
                              {!!onDelete && (
                                <button
                                  id={`${id}`}
                                  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm hover:text-gray-100 border-red-600 text-gray-700 capitalize transition-colors duration-200 hover:bg-red-600 border rounded-md sm:w-auto gap-x-2  dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                                  onClick={() => onDelete(id)}
                                >
                                  Deletar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
