'use client'
import { useState } from 'react'
import Modal from 'components/MediaViewer'
import ToggleInput from 'components/ToggleInput'
// DEPRECATED!!!

type TableWrapperProps = {
  data: any[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onClickRow?: (id: string) => void
  toggleActivation?: (id: string) => void
  section: string
}

// const mediasMock = [
//   'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/93e55b7409de1702cee02ccf1e2615a89c5e9cb74d84307d6d5bb2c5449ceca7.tenis1.webp',
//   'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/47d4674a8238be821ed71baad2eb55a30cd6c020bb9af82c2a2183c295c0e0fd.tenis_2.jpg',
//   'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/4b493e9211f72f0ab82f48d743b459a397b385e8e715f45670741465df173215.tenis3.webp',
//   'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/e591777d57dd75d92b29fcaffc771ea74d7a604c27e45dbc661be8c42e4eb56b.tenis4.webp'
// ]

export default function TableWrapper({
  data,
  onDelete,
  onClickRow,
  onEdit,
  toggleActivation,
  section
}: TableWrapperProps) {
  console.log('🚀 ~ file: index.tsx:30 ~ data:', data)
  const [inMemoryData, setInMemoryData] = useState(data)
  // const [open, setOpen] = useState(true)
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

  // function openMediaViewer(value: any) {
  //   const element = data.find((element: any) => element.id === value.id)
  //   if (element) setItemView(element)

  //   setOpen(true)
  // }

  console.log({ data })

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
                          {section}
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
                            : 'https://ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com/93e55b7409de1702cee02ccf1e2615a89c5e9cb74d84307d6d5bb2c5449ceca7.tenis1.webp'
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
                              <div>
                                {/* <a href="#" id={`${id}`}> */}
                                <h2 className="font-medium text-gray-800 dark:text-white ">
                                  {name}
                                </h2>
                                {/* </a> */}
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
