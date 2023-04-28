'use client'
import { useState } from 'react'
import Modal from 'components/MediaViewer'
import ToggleInput from 'components/ToggleInput'

type TableWrapperProps = {
  data: any[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onClickRow?: (id: string) => void
  toggleActivation?: (id: string) => void
}

export default function TableWrapper({
  data,
  onDelete,
  onClickRow,
  onEdit,
  toggleActivation
}: TableWrapperProps) {
  const [inMemoryData, setInMemoryData] = useState(data)
  const [open, setOpen] = useState(true)
  const [itemView, setItemView] = useState<{
    name: string
    description: string
  }>()

  function remove(id: string) {
    const userDecision = confirm('Confirmar deleção?')
    if (!userDecision) return

    const nextState = inMemoryData.filter(
      (element: any) => String(element.id) !== id
    )
    onDelete && onDelete(id)
    setInMemoryData(nextState)
  }

  function openMediaViewer(value: any) {
    const element = data.find((element: any) => element.id === value.id)
    if (element) setItemView(element)

    setOpen(true)
  }

  function mediasAdapter(mediasList: any[]) {
    return mediasList.map((media) => media.url)
  }

  return (
    <section className="w-full mx-auto">
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className=" divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl">
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {inMemoryData && !inMemoryData.length && (
                    <tr className="hover:bg-slate-100 bg-white rounded-full">
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center flex-col">
                          Nenhuma campanha adicionada.
                        </div>
                      </td>
                    </tr>
                  )}
                  {!!inMemoryData.length &&
                    inMemoryData.map(
                      ({ id, name, description, active, medias }: any) => {
                        const imgSource =
                          !!medias[0]?.url && medias[0]?.type === 'image'
                            ? medias[0]?.url
                            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
                        const imgAlt = 'imagem ícone'
                        // TODO: Passar o componente que vai ser renderizado para não travar esse destruction
                        return (
                          <tr
                            key={id}
                            className="hover:bg-slate-100 bg-white rounded hover:cursor-pointer"
                            onClick={() => onClickRow && onClickRow(id)}
                          >
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center flex-col">
                                <img
                                  className="object-cover w-14 h-12 -mx-1  rounded "
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
                                  medias={mediasAdapter(medias)}
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
                                    onClick={() => remove(id)}
                                  >
                                    Deletar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      }
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
